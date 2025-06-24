from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from scipy.sparse import csr_matrix
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import create_engine
import urllib

app = Flask(__name__)
CORS(app)

# ===== إعداد الاتصال بـ SQL Server =====
params = urllib.parse.quote_plus(
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=DESKTOP-SCV8LHF\\SQLEXPRESS;"
    "Database=startupDB;"
    "Trusted_Connection=yes;"
)
engine = create_engine(f"mssql+pyodbc:///?odbc_connect={params}")

# ===== تحميل البيانات من قاعدة البيانات =====
def load_data():
    investments = pd.read_sql("SELECT UserId AS investor_id, ProjectId AS object_id FROM investments", engine)
    projects = pd.read_sql("""
        SELECT p.Id AS object_id, p.ProjectName, p.Status, p.FundingRoundType, p.Funding_Source,
               p.TotalFundingRounds, p.TotalMilestones, p.MileStoneYear, p.TotalPartenerships,
               p.FundingAmount, p.NoOfInvestors, p.FundAmountRaised, p.FoundingYear, p.FundingYear,
               p.FundingFundYear, p.AverageFundingPerRound, p.CompanyAge, p.Budget, p.TotalFundingRecieved,
               pd.Description, pd.CompanyPhoto, p.Category
        FROM projects p LEFT JOIN ProjectDetails pd ON pd.ProjectId = p.Id
    """, engine)
    return investments, projects

# تحميل البيانات أول مرة
investments_cache, projects_cache = load_data()

# ===== تحديث البيانات =====
def refresh_data():
    global investments_cache, projects_cache
    investments_cache, projects_cache = load_data()

# ===== دالة التوصية =====
def recommend_for_investor(investor_id, investments, projects, top_n=8):
    interaction_matrix = pd.pivot_table(
        investments,
        index='investor_id',
        columns='object_id',
        aggfunc=lambda x: 1,
        fill_value=0
    )

    # دعم المستخدمين الجدد
    if investor_id not in interaction_matrix.index:
        new_row = pd.DataFrame(data=0, index=[investor_id], columns=interaction_matrix.columns)
        interaction_matrix = pd.concat([interaction_matrix, new_row])

    # السماح بالحجم الصغير جداً
    if interaction_matrix.shape[0] < 1 or interaction_matrix.shape[1] < 1:
        return []

    interaction_sparse = csr_matrix(interaction_matrix.values)

    feature_cols = [
        'TotalFundingRounds', 'TotalMilestones', 'MileStoneYear',
        'TotalPartenerships', 'FundingAmount', 'NoOfInvestors',
        'FundAmountRaised', 'FoundingYear', 'FundingYear', 'FundingFundYear',
        'AverageFundingPerRound', 'CompanyAge', 'Budget', 'TotalFundingRecieved'
    ]

    project_features = projects.drop_duplicates(subset='object_id')[['object_id'] + feature_cols]
    project_features = project_features.dropna(subset=feature_cols)

    if project_features.empty:
        return []

    project_features.set_index('object_id', inplace=True)
    project_matrix = csr_matrix(project_features.values)

    # تحديد عدد المكونات المشترك
    common_components = min(3, interaction_matrix.shape[0], interaction_matrix.shape[1], project_matrix.shape[0], project_matrix.shape[1])
    if common_components < 1:
        return []

    svd_investor = TruncatedSVD(n_components=common_components)
    investor_embeddings = svd_investor.fit_transform(interaction_sparse)

    svd_project = TruncatedSVD(n_components=common_components)
    project_embeddings = svd_project.fit_transform(project_matrix)

    investor_vec = investor_embeddings[interaction_matrix.index.get_loc(investor_id)]
    similarities = cosine_similarity([investor_vec], project_embeddings)[0]
    project_ids = project_features.index.tolist()
    sim_scores = list(zip(project_ids, similarities))

    invested = interaction_matrix.loc[investor_id]
    already_invested = set(invested[invested > 0].index)

    filtered = [(pid, score) for pid, score in sim_scores if pid not in already_invested]
    filtered = sorted(filtered, key=lambda x: x[1], reverse=True)[:top_n]
    recommended_ids = [pid for pid, _ in filtered]

    result = projects[projects['object_id'].isin(recommended_ids)].drop_duplicates(subset='object_id')
    result['similarity'] = result['object_id'].map(dict(filtered))

    base_url = "https://localhost:7010"
    final = []
    for _, row in result.iterrows():
        final.append({
            "id": int(row["object_id"]),
            "projectName": row["ProjectName"],
            "description": row["Description"] if pd.notna(row["Description"]) else "",
            "category": row["Category"] if pd.notna(row["Category"]) else "",
            "image": None if pd.isna(row["CompanyPhoto"]) else f"{base_url}/images/{row['CompanyPhoto']}"
        })

    return final

# ===== نقطة النهاية للتوصية =====
@app.route('/recommend', methods=['GET'])
def recommend():
    try:
        investor_id = int(request.args.get('investor_id'))
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid or missing investor_id'}), 400

    refresh_data()

    recommendations = recommend_for_investor(investor_id, investments_cache, projects_cache)
    if not recommendations:
        return jsonify({'message': 'No recommendations available for this investor'}), 200

    return jsonify(recommendations)

# ===== نقطة النهاية لإضافة استثمار جديد =====
@app.route('/investment', methods=['POST'])
def add_investment():
    data = request.get_json()
    investor_id = data.get('investor_id')
    project_id = data.get('project_id')

    if not investor_id or not project_id:
        return jsonify({'error': 'Missing investor_id or project_id'}), 400

    # ملاحظة: لا يوجد حفظ فعلي في قاعدة البيانات هنا

    refresh_data()

    return jsonify({
        'message': f'Investment recorded for investor {investor_id} in project {project_id}'
    }), 200

# ===== تشغيل السيرفر =====
if __name__ == '__main__':
    app.run(debug=True)
