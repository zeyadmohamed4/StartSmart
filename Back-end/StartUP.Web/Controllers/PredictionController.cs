using Microsoft.AspNetCore.Mvc;
using StartUP.Data.Entity;
using StartUP.Service.Dtos.Prediction;
using StartUP.Service.PredictionService;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class PredictionController : ControllerBase
{
    private readonly IPredictionService _predictionService;

    public PredictionController(IPredictionService predictionService)
    {
        _predictionService = predictionService;
    }

    [HttpPost("project_status")]
    public async Task<IActionResult> ProjectStatus(PredictionStatusDto predictionStatusDto ,int projectId)
    {
        var result = await _predictionService.PredictProjectStatusAsync(predictionStatusDto,projectId);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("analyze")]
    public async Task<IActionResult> Analyze([FromQuery] int projectId)
    {
        var fundingRoundType = await _predictionService.PredictFundingRoundTypeAsync(projectId);
        var totalFundingRecieved = await _predictionService.PredictTotalFundingRecievedAsync(projectId);
        var fundingAmount = await _predictionService.PredictFundingAmountAsync(projectId);

        if (fundingRoundType is null && totalFundingRecieved is null && fundingAmount is null)
            return NotFound();

        var result = new
        {
            FundingRoundType = fundingRoundType,
            TotalFundingRecieved = totalFundingRecieved,
            FundingAmount = fundingAmount
        };

        return Ok(result);
    }


     [HttpPost("save-prediction/{projectId}")]
     public async Task<IActionResult> SavePrediction(int projectId, [FromBody] PredictionResultsDto results)
     {
         if (results is null)
             return BadRequest("Missing prediction results.");
   
         int userId = await _predictionService.SaveFundingDetailsAsync(
             projectId,
             results.TotalFundingRecieved,
             results.FundingRoundType,
             results.FundingAmount);
   
         if (userId == -1)
             return NotFound("Failed to save prediction for the given project.");
   
         return Ok(new
         {
             userId = userId,
             message = $"Prediction saved successfully for user {userId}."
         });
     }
    [HttpGet("getPrediction")]
    public async Task<IActionResult> GetPrediction (int projectId)
    {
        var result = await _predictionService.GetPredictionAsync(projectId);
        return Ok(result);
    }

    [HttpGet("getrecommendations")]
    public async Task<IActionResult> GetRecommendations()
    {
        try
        {
            var result = await _predictionService.GetProjectsBasedOnRoleAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }



}
