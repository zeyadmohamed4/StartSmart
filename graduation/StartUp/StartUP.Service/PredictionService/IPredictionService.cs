using StartUP.Service.Dtos.Prediction;
using StartUP.Service.Dtos.Project;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.PredictionService
{
    public interface IPredictionService
    {
       // Task<object?> PredictProjectStatusAsync(int projectId);
        Task<object?> PredictFundingRoundTypeAsync(int projectId);
        Task<object?> PredictRecomendationAsync(int investorId);
        Task<object?> PredictTotalFundingRecievedAsync(int projectId);
        Task<object?> PredictFundingAmountAsync(int projectId);
        Task<int> SaveFundingDetailsAsync(int projectId, decimal totalFunding, string roundType, decimal fundingAmount);
        Task<PredictionResponseDto> GetPredictionAsync(int projectId);
        Task<object?> PredictProjectStatusAsync(PredictionStatusDto predictionStatusDto, int projectId);



        Task<IEnumerable<ProjectRandomDto>> GetRandomProjectAsync(int count);

        Task<object?> GetProjectsBasedOnRoleAsync();
    }
}
