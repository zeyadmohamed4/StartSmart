using StartUP.Data.Entity;
using StartUP.Service.Dtos.Contract;
using StartUP.Service.Dtos.Dashboards;
using StartUP.Service.Dtos.Investment;
using StartUP.Service.Dtos.Project;
using StartUP.Service.FeedBackService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.InvestmentService
{
    public interface IInvestmentService
    {
        Task<NewInvest> AddAsync(InvestmentRequestDto investment, int userId);
        Task<bool> AddContractAsync(AddContractDto contract, int investmentId);
        Task<bool> AddPaymentAsync(PaymentDto paymentDto, int investmentId);
     //   Task<bool> UpdateAsync(int id ,InvestmentRequestDto investment);
        Task<bool> DeleteAsync(int id);

        Task<IEnumerable<InvestmentResponseDto>> GetAllAsync();
       Task<IEnumerable<investmentPending>> GetAllPendingAsync();
        Task<InvestmentRequestDto> GetByIdAsync(int id);
     
        Task<int> GetInvestorCountByOwnerUserNameAsync(string ownerUserName);

        Task<int> GetTotalInvestmentsByOwnerUserNameAsync(string ownerUserName);

        Task<decimal> GetTotalRevenueByOwnerUserNameAsync(string ownerUserName);
        Task<int> GetTotalInvestmentsAsync();
        Task<decimal> GetTotalRevenueAsync();

        Task<decimal> CalculateRoiByUsernameAsync(string InvestorUserName);          //for ROI in Investor dashboard 
        Task<decimal> CalculateAverageAnnualGrowthAsync(string InvestorUserName);
        Task<Dictionary<string, int>> GetMostFundedCategoriesAsync(string InvestorUserName);
        Task<decimal> CalculateTotalDividendsEarnedAsync(string InvestorUserName);
        Task<IEnumerable<InvestorMonthGrowthDto>> GetInvestorNetRevenueByMonthAsyncForInvestorAsync(string investorUserName);
        Task<IEnumerable<RevenueDistrubtionDTO>> GetProjectRoiListByInvestorAsync(string investorUserName);      //retuen each project investment with its ROI
        Task<IEnumerable<MonthlyProjectNetRevenueDto>> GetProjectsWithNetRevenueByInvestorMonthlyAsync(string investorUserName);
        //  Task<IEnumerable<InvestmentResponseDto>> GetInvestmentInMyProjectAsync(string username);
        Task<InvestmentResponseDto> GetInvestment(int projectId, int userId);
        Task<AceeptN> AcceptInvestment(AcceptDto acceptInvestmentDto, int SenderId, int notfiId);

        Task<bool> RejectInvestment(AcceptDto acceptInvestmentDto, int SenderId, int notifId);
        Task<bool> DeleteInvestment(int investmentId, int senderId);

    }
}
