using Microsoft.Extensions.Logging;
using StartUP.Data.Entity;
using StartUP.Repository.ProjectRepo;
using StartUP.Service.Dtos.Prediction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using StartUP.Service.Dtos.Project;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using StartUP.Repository.InvestmentRepo;

namespace StartUP.Service.PredictionService
{
    public class PredictionService : IPredictionService
    {
        private readonly IProjecRepo _projectRepo;
        private readonly HttpClient _httpClient;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IInvestmentRepo _investmentRepo;

        public PredictionService(IProjecRepo projectRepo,
                                 IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor,IInvestmentRepo  investmentRepo)
        {
            _projectRepo = projectRepo;
            _httpContextAccessor = httpContextAccessor;
            _investmentRepo = investmentRepo;
            _httpClient = httpClientFactory.CreateClient();
        }

        public async Task<object?> PredictProjectStatusAsync(PredictionStatusDto predictionStatusDto , int projectId)
        {
            var project = await _projectRepo.GetByIdAsync(projectId);
            if (project == null) return null;
          
            var totalInvestForProject = await _projectRepo.GetTotalInvestmentForProjectAsync(projectId);
            var totalFundingRecieved =project.TotalFundingRecieved +predictionStatusDto.TotalFundingRecieved + totalInvestForProject;
            var dto = new ProjectStatusDto
            {
                TotalFundingRecieved = totalFundingRecieved, /// + investamount from form + total invest for project
                FundingAmount = project.FundingAmount,
                TotalFundingRounds = project.TotalFundingRounds,
                TotalMilestones = project.TotalMilestones,
                TotalPartenerships = project.TotalPartenerships,
                NoOfInvestors = project.NoOfInvestors,
                FoundingYear = project.FoundingYear,
                FundingYear = predictionStatusDto.FundingYear, /// from form
                MileStoneYear = project.MileStoneYear,
                AverageFundingPerRound = project.AverageFundingPerRound,
                TimeToFirstFunding = Math.Round((project.FirstFundedAt - new DateTime(project.FoundingYear, 1, 1)).TotalDays / 365.0, 2),
                CategoryEncoder = (int)project.Category,
                IsActiveTillYear = project.IsActiveTill.Year
            };

            return await SendToFlask("project_status", dto);
        }

        public async Task<object?> PredictFundingRoundTypeAsync(int projectId)
        {
            var project = await _projectRepo.GetByIdAsync(projectId);
            if (project == null) return null;

            var dto = new FundingRoundTypeDto
            {
                TotalFundingRecieved = project.TotalFundingRecieved,
                TotalFundingRounds = project.TotalFundingRounds,
                TotalPartenerships = project.TotalPartenerships,
                NoOfInvestors = project.NoOfInvestors,
                FundingAmount = project.FundingAmount,
                FoundingYear = project.FoundingYear,
                FundingYear = project.FundingYear,
                CompanyAge = project.CompanyAge,
                AverageFundingPerRound = project.AverageFundingPerRound,
                TimeToFirstFunding = Math.Round((project.FirstFundedAt - new DateTime(project.FoundingYear, 1, 1)).TotalDays / 365.0, 2),
                CategoryEncoder = (int)project.Category,
                StatusEncoder = MapStatusToCode(project.Status)
            };

            return await SendToFlask("funding_round_type", dto);
        }

        public async Task<object?> PredictTotalFundingRecievedAsync(int projectId)
        {
            var project = await _projectRepo.GetByIdAsync(projectId);
            if (project == null) return null;

            var dto = new TotalFundingRecievedDto
            {
                TotalFundingRounds = project.TotalFundingRounds,
                TotalMilestones = project.TotalMilestones,
                TotalPartenerships = project.TotalPartenerships,
                NoOfInvestors = project.NoOfInvestors,
                FundingAmount = project.FundingAmount,
                FundAmountRaised = project.FundAmountRaised,
                FoundingYear = project.FoundingYear,
                FundingYear = project.FundingYear,
                FundingFundYear = project.FundingFundYear,
                AverageFundingPerRound = project.AverageFundingPerRound,
                TimeToFirstFunding = Math.Round((project.FirstFundedAt - new DateTime(project.FoundingYear, 1, 1)).TotalDays / 365.0, 2),
                CategoryEncoder = (int)project.Category,
                StatusEncoder = MapStatusToCode(project.Status),
                FundingRoundTypeEncoder = MapFundingRoundTypeToCode(project.FundingRoundType)
            };

            return await SendToFlask("total_funding_recieved", dto);
        }

        public async Task<object?> PredictFundingAmountAsync(int projectId)
        {
            var project = await _projectRepo.GetByIdAsync(projectId);
            if (project == null) return null;

            var dto = new FundingAmountDto
            {
                TotalFundingRecieved = project.TotalFundingRecieved,
                TotalFundingRounds = project.TotalFundingRounds,
                TotalMilestones = project.TotalMilestones,
                FoundingYear = project.FoundingYear,
                FundingYear = project.FundingYear,
                CompanyAge = project.CompanyAge,
                AverageFundingPerRound = project.AverageFundingPerRound,
                TimeToFirstFunding = Math.Round((project.FirstFundedAt - new DateTime(project.FoundingYear, 1, 1)).TotalDays / 365.0, 2),
                CategoryEncoder = (int)project.Category,
                StatusEncoder = MapStatusToCode(project.Status),
                CountryEncoder = MapCountryToCode(project.Country),
                FundingRoundTypeEncoder = MapFundingRoundTypeToCode(project.FundingRoundType)
            };

            return await SendToFlask("funding_amount", dto);
        }
        public async Task<object?> PredictRecomendationAsync(int investorId)
        {
            return await SendToFlaskRec(investorId);
        }

        public async Task<IEnumerable<ProjectRandomDto>> GetRandomProjectAsync(int count)
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";

            var projects = await _projectRepo.GetRandomProjectAsync(count);
            return projects.Select(p => new ProjectRandomDto
            {
                Id = p.Id,
                ProjectName = p.ProjectName,
                Description = p.ProjectDetails?.Description ?? string.Empty,
                Category = p.Category.ToString(),
                Image = string.IsNullOrEmpty(p.ProjectDetails?.CompanyPhoto)
                    ? null
                    : $"{baseUrl}/images/{p.ProjectDetails.CompanyPhoto}",
                FromWho = "Random"
            });
        }

        public async Task<object?> GetProjectsBasedOnRoleAsync()
        {
            var user = _httpContextAccessor.HttpContext?.User;

            if (user == null || !user.Identity.IsAuthenticated)
                return await GetRandomProjectAsync(5); // Default if unauthenticated

            var role = user.FindFirst(ClaimTypes.Role)?.Value;
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(role) || string.IsNullOrEmpty(userIdClaim))
                return await GetRandomProjectAsync(5); // Default if claims missing

            if (!int.TryParse(userIdClaim, out int userId))
                return await GetRandomProjectAsync(5); // Default if userId parsing fails

            // Owner: Always get random projects
            if (role == "Owner")
            {
                return await GetRandomProjectAsync(8);
            }

            // Investor: check if user has any investments
            if (role == "Investor")
            {
                bool hasInvestments = await _investmentRepo.HasInvestmentsAsync(userId);

                if (!hasInvestments)
                {
                    return await GetRandomProjectAsync(5);
                }
                else
                {
                    return await PredictRecomendationAsync(userId);
                }
            }

            // Default fallback: get random projects
            return await GetRandomProjectAsync(5);
        }


        private async Task<JsonDocument> SendToFlask(string modelName, object dto)
        {
            var url = $"http://192.168.1.14:5000/predict/{modelName}";

            try
            {
                var response = await _httpClient.PostAsJsonAsync(url, dto);
                var content = await response.Content.ReadAsStringAsync();

                var json = JsonDocument.Parse(content);

                if (!response.IsSuccessStatusCode)
                {
                    // حاول تقرأ رسالة الخطأ من JSON لو موجودة
                    if (json.RootElement.TryGetProperty("error", out var errorProp))
                    {
                        string errorMessage = errorProp.GetString() ?? "Unknown error";

                        if (response.StatusCode == HttpStatusCode.NotFound)
                        {
                            errorMessage = $"Model '{modelName}' not found at endpoint '{url}': {errorMessage}";
                        }

                        throw new Exception($"Flask API Error {response.StatusCode}: {errorMessage}");
                    }

                    // مفيش "error" في الـbody، نرمي الرسالة كاملة
                    throw new Exception($"Flask API Error {response.StatusCode}: {content}");
                }

                // Success - رجّع الـ JSON
                return json;
            }
            catch (JsonException)
            {
                throw new Exception("Failed to parse JSON from Flask API response.");
            }
            catch (Exception ex)
            {
                throw new Exception($"Exception while calling Flask API: {ex.Message}", ex);
            }
        }

        private async Task<JsonDocument> SendToFlaskRec(int investorId)
        {
            var url = $"http://127.0.0.1:5000/recommend?investor_id={investorId}";

            try
            {
                var response = await _httpClient.GetAsync(url);
                var content = await response.Content.ReadAsStringAsync();

                var json = JsonDocument.Parse(content);

                if (!response.IsSuccessStatusCode)
                {
                    // حاول تقرأ رسالة الخطأ من JSON لو موجودة
                    if (json.RootElement.TryGetProperty("error", out var errorProp))
                    {
                        string errorMessage = errorProp.GetString() ?? "Unknown error";

                        if (response.StatusCode == HttpStatusCode.NotFound)
                        {
                            errorMessage = $"Endpoint not found: {url} - {errorMessage}";
                        }

                        throw new Exception($"Flask API Error {response.StatusCode}: {errorMessage}");
                    }

                    // مفيش "error" في الـbody، نرمي الرسالة كاملة
                    throw new Exception($"Flask API Error {response.StatusCode}: {content}");
                }

                // Success - رجّع الـ JSON
                return json;
            }
            catch (JsonException)
            {
                throw new Exception("Failed to parse JSON from Flask API response.");
            }
            catch (Exception ex)
            {
                throw new Exception($"Exception while calling Flask API: {ex.Message}", ex);
            }
        }

        public async Task<int> SaveFundingDetailsAsync(int projectId, decimal totalFunding, string roundType, decimal fundingAmount)
        {
            var project = await _projectRepo.GetByIdAsync(projectId);
            if (project == null) throw new Exception("Project Not Found");

            try
            {
                // 1. تحديد مدة كل نوع جولة (بدون حساسية لحالة الحروف)
                var roundDurations = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
        {
            { "Series-A", 90 },
            { "Series-B", 60 },
            { "Series-C+", 120 },
            { "Venture", 150 },
            { "Angel", 30 },
            { "Private-Equity", 180 },
            { "Post-Ipo", 240 },
            { "CrowdFunding", 45 },
            { "Other", 60 }
        };

                // 2. الحصول على المدة الزمنية بناءً على نوع الجولة (بدون حساسية لحالة الحروف)
                int durationInDays = roundDurations.GetValueOrDefault(roundType, roundDurations["Other"]);

                // 3. حساب تاريخ نهاية الحملة
                DateTime endDate = DateTime.UtcNow.AddDays(durationInDays);

                // 4. التأكد من وجود FundingDetails
                if (project.FundingDetails == null)
                {
                    project.FundingDetails = new FundingDetails();
                }

                // 5. تحديث بيانات التمويل
                project.FundingDetails.TotalInvestment = totalFunding;
                project.FundingDetails.NextRoundType = roundType;
                project.FundingDetails.NextRoundFunding = fundingAmount;
                project.FundingDetails.EndDate = endDate;

                // 6. حفظ التعديلات
                await _projectRepo.SaveChangesAsync();

                return project.UserId;
            }
            catch (Exception ex)
            {
                // يمكنك تسجيل الخطأ هنا إن حبيت
                return -1; // فشل في الحفظ
            }
        }



        public async Task<PredictionResponseDto> GetPredictionAsync(int projectId)
        {
            var prediction = await _projectRepo.GetFundingDetailsAsync(projectId);
            if (prediction == null) throw new Exception($"No FundingDetails for this project {projectId}");
            return new PredictionResponseDto
            {
                NextRoundFunding= prediction.NextRoundFunding,
                NextRoundType= prediction.NextRoundType,
                TotalInvestment = prediction.TotalInvestment,
            };
        }


        private int MapCountryToCode(string? country) => country?.ToLower() switch
        {
            "egypt" => 26,
            "usa" => 1,
            _ => 0
        };

        private int MapStatusToCode(string? status) => status?.ToLower() switch
        {
            "closed" => 1,
            "ipo" => 2,
            "operating" => 3,
            "acquired" => 0
        };

        private int MapFundingRoundTypeToCode(string? type) => type?.ToLower() switch
        {
            "angel" => 0,
            "crowdfunding" => 1,
            "other" => 2,
            "post-ipo" => 3,
            "private-equity" => 4,
            "series-a" => 5,
            "series b" => 6,
            "series-c+" => 7,
            "venture" => 8,
            _ => -1
        };

       
    }
}
