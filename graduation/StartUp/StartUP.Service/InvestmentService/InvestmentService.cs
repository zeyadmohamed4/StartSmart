using Microsoft.EntityFrameworkCore;
using AutoMapper;
using StartUP.Data.Entity;
using StartUP.Repository.InvestmentRepo;
using StartUP.Repository.ProjectRepo;
using StartUP.Repository.UserRepo;
using StartUP.Service.FeedBackService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StartUP.Repository;
using StartUP.Service.Dtos.Dashboards;
using StartUP.Service.Dtos.Investment;
using StartUP.Service.Dtos.Project;
using System.Data.Entity;
using StartUP.Service.Dtos.Contract;
using StartUP.Service.Dtos.User;

namespace StartUP.Service.InvestmentService
{
    public class InvestmentService : IInvestmentService
    {


        private readonly IInvestmentRepo _investRepo;
        private readonly IMapper _mapper;
        private readonly IUserRepo _userRepo;
        private readonly IProjecRepo _projectRepo;
        private readonly INotificationRepository _notificationRepo;

        public InvestmentService(IInvestmentRepo investRepo, IMapper mapper, IUserRepo userRepo, INotificationRepository notificationRepo, IProjecRepo projectRepo)
        {
            _investRepo = investRepo;
            _mapper = mapper;
            _userRepo = userRepo;
            _notificationRepo = notificationRepo;
            _projectRepo = projectRepo;
        }
        public async Task<NewInvest> AddAsync(InvestmentRequestDto investmentdto, int userId)
        {
            var project = await _investRepo.GetByProjectNameAsync(investmentdto.ProjectName)
                ?? throw new InvalidOperationException("Project not found.");

            var user = await _investRepo.GetByUserId(userId)
                ?? throw new InvalidOperationException("User not found.");

            if (string.IsNullOrWhiteSpace(user.Role))
                throw new InvalidOperationException("User role is not assigned.");

            if (user.Role.ToLower() != "investor")
                throw new InvalidOperationException("Only users with role 'investor' are allowed to invest.");

            if (project.UserId == userId)
                throw new InvalidOperationException("Investor cannot invest in a project they own.");

            var investment = new Investment
            {
               
                ProjectId = project.Id,
                UserId = userId,
                InvestmentAmount = investmentdto.InvestmentAmount,
                Revenue = investmentdto.Revenue,
                EquityPercentage = investmentdto.EquityPercentage,
                InterestRate = investmentdto.InterestRate,
                RevenueShare = investmentdto.RevenueShare,
                InvestmentStatus= "Pending"
            };

            if (!await _investRepo.AddAsync(investment))
                throw new InvalidOperationException("Investment could not be added.");

            var companyDeal = project.CompanyDeal;

            if (companyDeal == null)
                throw new InvalidOperationException("Project does not have a CompanyDeal configured.");


            var fullMessage =
       $"🚀 Big News! {user.UserName} just invested {investmentdto.InvestmentAmount:C} in your project \"{investmentdto.ProjectName}\"!{Environment.NewLine}" +
       $"💰 Investment Summary:{Environment.NewLine}";

            if (investmentdto.Revenue != 0)
                fullMessage += $"- 📊 Expected Revenue: {investmentdto.Revenue:C}{Environment.NewLine}";

            if (investmentdto.EquityPercentage != 0)
                fullMessage += $"- 🧮 Equity Percentage: {investmentdto.EquityPercentage}%{Environment.NewLine}";

            if (investmentdto.InterestRate != 0)
                fullMessage += $"- 💵 Interest Rate: {investmentdto.InterestRate}%{Environment.NewLine}";

            if (investmentdto.RevenueShare != 0)
                fullMessage += $"- 🤝 Revenue Share: {investmentdto.RevenueShare}%{Environment.NewLine}";

            fullMessage += "🎯 Keep pushing forward — your project's growth is in motion!";



            var notification = new Notification
            {
                SenderId = userId,
                ReceiverId = project.UserId,
                ProjectId = project.Id,
                Message = $"Your project {investmentdto.ProjectName} received a new investment!",
                FullMessage = fullMessage,
                IsUnread = true,
                CreatedAt = DateTime.UtcNow,
                Type= "investment-request"
            };

            await _notificationRepo.AddAsync(notification);

            return new NewInvest { InvestmentId = investment.Id, InvestmentStatus = investment.InvestmentStatus };
        }


        public async Task<bool> DeleteAsync(int id)
        {
            return await _investRepo.DeleteAsync(id);
        }
        public async Task<IEnumerable<InvestmentResponseDto>> GetAllAsync()
        {
            
            var investments = await _investRepo.GetAllAsync();

            return investments.Select(s => new InvestmentResponseDto
            {
                Id= s.Id,
                InvestorName = s.User.UserName,
                ProjectName = s.Project.ProjectName,
                InvestmentAmount = s.InvestmentAmount,
                Revenue = s.Revenue,
                EquityPercentage = s.EquityPercentage,
                InterestRate = s.InterestRate,
                RevenueShare = s.RevenueShare,
                Date = s.CreatedAt,
                Status = s.IsActive ? "IsActive" : "Pending",
                Category = s.Project.Category.ToString(),
                ProjectDetails = s.Project?.ProjectDetails?.Description
            });
        }




        public async Task<InvestmentRequestDto> GetByIdAsync(int id)
        {
            var investment = await _investRepo.GetByIdAsync(id);
            return _mapper.Map<InvestmentRequestDto>(investment);
        }

        //public async Task<bool> UpdateAsync(int id, InvestmentDto investmentdto)
        //{
        //    var invest = await _investRepo.GetByIdAsync(id);

        //    if (invest == null) return false;
        //    var project = await _investRepo.GetByProjectNameAsync(investmentdto.ProjectName);

        //    if (project == null)
        //    {
        //        throw new Exception("Project Not Found");
        //    }

        //    invest.ProjectId = project.Id;
        //    invest.InvestmentAmount = investmentdto.InvestmentAmount;
        //    invest.InterestRate = investmentdto.InterestRate;
        //    invest.InvestmentHorizon = Enum.Parse<InvestmentHorizon>(investmentdto.InvestmentHorizon);
        //    invest.TermLength = Enum.Parse<TermLength>(investmentdto.TermLength);
        //    invest.IncomePreference = Enum.Parse<IncomePreference>(investmentdto.IncomePreference);
        //    invest.RiskTolerance = Enum.Parse<RiskTolerance>(investmentdto.RiskTolerance);
        //    invest.Revenue = investmentdto.Revenue;

        //    return await _investRepo.UpdateAsync(invest);

        //}

        public async Task<IEnumerable<investmentPending>> GetAllPendingAsync()
        {
            var investments = await _investRepo.GetAllPendingAsync();
            return investments.Select(s => new investmentPending
            {
                Id = s.Id,
                InvestorName = s.User.UserName,
                ProjectName = s.Project.ProjectName,
                Amount = s.InvestmentAmount,
                InterestRate = s.InterestRate.Value,
                Date = s.CreatedAt,
                Status = s.IsActive ? "IsActive" : "Pending",
                InvestmentHorizon = s.Project.CompanyDeal.InvestmentHorizon,
                IncomePreference = s.Project.CompanyDeal.IncomePreference,
                RiskTolerance = s.Project.CompanyDeal.RiskTolerance,
            });
        }




        public async Task<AceeptN> AcceptInvestment(AcceptDto acceptInvestmentDto, int SenderId, int notfiId)
        {
            var notif = await _notificationRepo.GetByIdAsync(notfiId);
            var investment = await _investRepo.GetByIdAsync(acceptInvestmentDto.Id);
            if (investment == null) throw new Exception("Investment Not Found");

            investment.IsActive = true;
            investment.InvestmentStatus = "Approved";
            await _investRepo.UpdateAsync(investment);
            if (notif == null) throw new Exception("Notification Not Found");
            notif.Status = "Accepted";
            await _notificationRepo.UpdateAsync(notif);
            // إرسال نوتيفيكيشن بالقبول
            var message = "🎉 Your investment has been accepted!";
            var fullMessage = $"Your Investment Of {investment.InvestmentAmount:C} In project Name: {investment.Project.ProjectName} Has Been Accepted By the Project Owner: {investment.Project.User.UserName}.";

            var notification = new Notification
            {
                ReceiverId = investment.UserId,
                SenderId = SenderId,
                ProjectId = investment.ProjectId,
                Message = message,
                FullMessage = fullMessage,
                IsUnread = true,
                CreatedAt = DateTime.UtcNow,
                Status = "Accepted"
            };

            await _notificationRepo.AddAsync(notification);


            decimal minInvestment = await CalculateMinimumInvestmentAsync(investment.ProjectId);
            decimal maxInvestment = await CalculateMaximumInvestmentAsync(investment.ProjectId);
            return new AceeptN
            {

                InvestmentAmount = investment.InvestmentAmount,
                InvestorName = investment.User.Name,
                InvestmentStatus = investment.InvestmentStatus,
                ProjectName = investment.Project.ProjectName,
                ProjectId = investment.ProjectId,
                CampaignDealType = investment.Project.CompanyDeal.DealType,
                MaxInvest = maxInvestment,
                MinInvest = minInvestment,

            };
        }

        public async Task<bool> RejectInvestment(AcceptDto acceptInvestmentDto, int SenderId, int notifId)
        {
            var notif = await _notificationRepo.GetByIdAsync(notifId);
            var investment = await _investRepo.GetByIdAsync(acceptInvestmentDto.Id);
            if (investment == null) throw new Exception("Investment Not Found");
            if (notif == null) throw new Exception("Notification Not Found");
            notif.Status = "Rejected";
            await _notificationRepo.UpdateAsync(notif);
            // إرسال نوتيفيكيشن بالرفض قبل الحذف
            var message = "❌ Your investment has been rejected.";
            var fullMessage = $"Unfortunately, your investment of {investment.InvestmentAmount:C} In project Name: {investment.Project.ProjectName} was rejected by the project owner: {investment.Project.User.UserName}.";

            var notification = new Notification
            {
                ReceiverId = investment.UserId,
                SenderId = SenderId,
                ProjectId = investment.ProjectId,
                Message = message,
                FullMessage = fullMessage,
                IsUnread = true,
                CreatedAt = DateTime.UtcNow
            };

            await _notificationRepo.AddAsync(notification);

            await _investRepo.Delete(investment);

            return true;
        }

        public async Task<bool> DeleteInvestment(int investmentId, int senderId)
        {
            var investment = await _investRepo.GetByIdAsync(investmentId);
            if (investment == null) throw new Exception("Investment Not Found");

            // Send notification ONLY to the project owner
            var ownerMessage = "🗑️ An investment in your project has been deleted.";
            var ownerFullMessage = $"An investment of {investment.InvestmentAmount:C} in your project '{investment.Project.ProjectName}' by {investment.User.Name} has been deleted.";

            var ownerNotification = new Notification
            {
                ReceiverId = investment.Project.UserId, // The project owner
                SenderId = senderId,
                ProjectId = investment.ProjectId,
                Message = ownerMessage,
                FullMessage = ownerFullMessage,
                IsUnread = true,
                CreatedAt = DateTime.UtcNow,
                Type = "investment-deleted" // Added type for better tracking
            };

            await _notificationRepo.AddAsync(ownerNotification);
            await _investRepo.Delete(investment);

            return true;
        }


        public async Task<int> GetInvestorCountByOwnerUserNameAsync(string ownerUserName)
        {
            return await _investRepo.GetInvestorCountByOwnerUserNameAsync(ownerUserName);
        }

        public async Task<int> GetTotalInvestmentsByOwnerUserNameAsync(string ownerUserName)
        {
            return await _investRepo.GetTotalInvestmentsByOwnerUserNameAsync(ownerUserName);
        }

        public async Task<decimal> GetTotalRevenueByOwnerUserNameAsync(string ownerUserName)
        {
            return await _investRepo.GetTotalRevenueByOwnerUserNameAsync(ownerUserName);
        }

        public async Task<int> GetTotalInvestmentsAsync()
        {
            return await _investRepo.GetTotalInvestmentsAsync();
        }
        public async Task<decimal> GetTotalRevenueAsync()
        {
            return await _investRepo.GetTotalRevenueAsync();
        }

        public async Task<decimal> CalculateRoiByUsernameAsync(string InvestorUserName)
        {
            var investments = await _investRepo.GetInvestmentsByUsernameAsync(InvestorUserName);

            if (investments == null || !investments.Any())
                return 0;

            decimal totalInvestment = investments.Sum(i => i.InvestmentAmount);
            decimal totalRevenue = investments.Sum(i => i.Revenue);

            if (totalInvestment == 0)
                return 0;

            decimal roi = ((totalRevenue - totalInvestment) / totalInvestment) * 100;
            return Math.Round(roi, 2);
        }


        public async Task<IEnumerable<RevenueDistrubtionDTO>> GetProjectRoiListByInvestorAsync(string investorUserName)
        {
            var investments = await _investRepo.GetInvestmentsByUsernameAsync(investorUserName);

            if (investments == null || !investments.Any())
            {
                throw new Exception($"No investments found for investor '{investorUserName}'");
            }

            // تجميع الاستثمارات حسب المشروع
            var groupedByProject = investments
                .GroupBy(i => i.Project?.ProjectName)
                .Select(g => new RevenueDistrubtionDTO
                {
                    ProjectName = g.Key, // اسم المشروع
                    ROI = g.Sum(i => i.Revenue) == 0 || g.Sum(i => i.InvestmentAmount) == 0
                        ? 0
                        : Math.Round(((g.Sum(i => i.Revenue) - g.Sum(i => i.InvestmentAmount)) / g.Sum(i => i.InvestmentAmount)) * 100, 2) // حساب الـ ROI
                });

            return groupedByProject;
        }


        public async Task<decimal> CalculateAverageAnnualGrowthAsync(string InvestorUserName)
        {
            var investments = await _investRepo.GetInvestmentsByUsernameAsync(InvestorUserName);

            if (investments == null || !investments.Any())
                return 0;

            decimal totalGrowth = 0;
            int countedInvestments = 0;

            foreach (var inv in investments)
            {
                var gain = inv.Revenue - inv.InvestmentAmount;
                var years = (DateTime.UtcNow - inv.CreatedAt).Days / 365.0;

                if (years > 0)
                {
                    totalGrowth += (gain / inv.InvestmentAmount) / (decimal)years;
                    countedInvestments++;
                }
            }

            var avgGrowth = countedInvestments > 0 ? totalGrowth / countedInvestments : 0;
            return Math.Round(avgGrowth * 100, 2);
        }


        public async Task<Dictionary<string, int>> GetMostFundedCategoriesAsync(string InvestorUserName)
        {
            var investments = await _investRepo.GetInvestmentsByUsernameAsync(InvestorUserName);

            // Count the occurrences of each category
            var categoryCount = new Dictionary<string, int>();

            foreach (var investment in investments)
            {
                // Check if the project is not null and the category is defined
                if (investment.Project != null)
                {
                    var categoryName = Enum.GetName(typeof(Category), investment.Project.Category);

                    if (categoryName != null)
                    {
                        if (categoryCount.ContainsKey(categoryName))
                        {
                            categoryCount[categoryName]++;
                        }
                        else
                        {
                            categoryCount[categoryName] = 1;
                        }
                    }
                }
            }

            return categoryCount;
        }


        public async Task<decimal> CalculateTotalDividendsEarnedAsync(string investorUserName)
        {
            if (string.IsNullOrEmpty(investorUserName))
                return 0;

            var investments = await _investRepo.GetInvestmentsByUsernameAsync(investorUserName);

            if (investments == null || !investments.Any())
                return 0;

            decimal totalDividends = 0;

            foreach (var investment in investments)
            {
                if (investment == null || investment.ProjectId <= 0)
                    continue;

                var project = await _projectRepo.GetByIdAsync(investment.ProjectId);

                if (project?.CompanyDeal == null)
                    continue;

                var incomePreference = project.CompanyDeal.IncomePreference;

                if (string.IsNullOrEmpty(incomePreference))
                    continue;

                if (incomePreference == "Dividends" || incomePreference == "Both")
                {
                    totalDividends += investment.Revenue;
                }
            }

            return totalDividends;
        }


        //public async Task<decimal> CalculateTotalDividendsEarnedAsync(string InvestorUserName)
        //{
        //    var investments = await _investRepo.GetInvestmentsByUsernameAsync(InvestorUserName);


        //    // نحسب إجمالي الأرباح التي تمثل أرباح أرباح (Dividends)
        //    decimal totalDividends = 0;

        //    foreach (var investment in investments)
        //    {
        //        // إذا كانت الاستثمارات تتضمن أرباح أرباح فقط
        //        if (investment.IncomePreference == IncomePreference.Dividends || investment.IncomePreference == IncomePreference.Both)
        //        {
        //            totalDividends += investment.Revenue;
        //        }
        //    }

        //    return totalDividends;
        //}

        public async Task<IEnumerable<InvestorMonthGrowthDto>> GetInvestorNetRevenueByMonthAsyncForInvestorAsync(string investorUserName)
        {
            // تحديد التاريخ الذي يمثل بداية آخر 12 شهرًا (الـ 12 شهر الماضيين من اليوم)
            var twelveMonthsAgo = DateTime.Now.AddMonths(-11);

            // نجيب البيانات من الريبو بدل الداتا كونتكست
            var investments = await _investRepo.GetInvestmentsByUsernameAsync(investorUserName);

            // فلترة الاستثمارات التي تمت في آخر 12 شهرًا استنادًا إلى تاريخ "CreatedAt"
            var recentInvestments = investments
                .Where(i => i.CreatedAt >= twelveMonthsAgo)  // هنا نفلتر الاستثمارات التي تاريخ إنشائها أكبر أو يساوي التاريخ اللي هو 12 شهر مضت
                .ToList();

            if (!recentInvestments.Any())
            {
                throw new Exception($"There are no Investments for  '{investorUserName}' in the recent 12 months.");
            }

            var groupedByMonth = recentInvestments
                .GroupBy(i => new { i.CreatedAt.Year, i.CreatedAt.Month })  // تجميع الاستثمارات حسب السنة والشهر
                .Select(g =>
                {
                    // حساب الإيرادات الصافية لكل شهر (الإيرادات - الاستثمار)
                    return new InvestorMonthGrowthDto
                    {
                        Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM"),
                        NetRevenue = g.Sum(i => i.Revenue) - g.Sum(i => i.InvestmentAmount),
                    };
                })
                .OrderBy(m => DateTime.ParseExact(m.Month, "MMMM", null).Month)  // ترتيب الأشهر من يناير إلى ديسمبر
                .ToList();

            return groupedByMonth;
        }




        public async Task<IEnumerable<MonthlyProjectNetRevenueDto>> GetProjectsWithNetRevenueByInvestorMonthlyAsync(string investorUserName)
        {
            // جلب كل الاستثمارات الخاصة بالمستثمر
            var investments = await _investRepo.GetInvestmentsByUsernameAsync(investorUserName);

            if (investments == null || !investments.Any())
            {
                throw new Exception($"No investments found for investor '{investorUserName}'");
            }

            // جلب المشاريع المتعلقة بالاستثمارات وحساب الـ Net Revenue لكل مشروع في كل شهر
            var result = investments
                .GroupBy(i => new { i.CreatedAt.Year, i.CreatedAt.Month }) // تجميع حسب السنة والشهر
                .Select(g => new MonthlyProjectNetRevenueDto
                {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    Projects = g.GroupBy(i => i.Project)
                                .Select(projectGroup => new ProjectNetRevenueDto
                                {
                                    ProjectName = projectGroup.Key.ProjectName,
                                    NetRevenue = projectGroup.Sum(i => i.Revenue) - projectGroup.Sum(i => i.InvestmentAmount)
                                })
                                .ToList()
                })
                .OrderBy(r => r.Year)
                .ThenBy(r => r.Month)
                .ToList(); // تحويل النتيجة إلى قائمة يمكن التعامل معها في الواجهة

            return result;
        }

        public async Task<InvestmentResponseDto> GetInvestment(int projectId, int userId)
        {
         var investment= await _investRepo.GetInvestment(projectId, userId);
            return new InvestmentResponseDto 
            {
               Id=investment.Id,
               InvestmentAmount = investment.InvestmentAmount,
               EquityPercentage =investment.EquityPercentage,
               InterestRate =investment.InterestRate,
               RevenueShare = investment.RevenueShare , 
               Revenue =investment.Revenue,
               Status=investment.InvestmentStatus,
               CompletePayment = investment.CompletePayment,
            };
        }

        public async Task<bool> AddContractAsync(AddContractDto contractdto, int id)
        {

            var invest = await _investRepo.GetByIdAsync(id);
            if (invest == null) return false;
            string imageName = null;
            if (contractdto.Image != null && contractdto.Image.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                Directory.CreateDirectory(uploadsFolder); // يتأكد إن المجلد موجود
                imageName = Guid.NewGuid().ToString() + Path.GetExtension(contractdto.Image.FileName);
                var filePath = Path.Combine(uploadsFolder, imageName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await contractdto.Image.CopyToAsync(stream);
                }
            }

            invest.FullName = contractdto.FullName;
            invest.Signature = contractdto.Signature;
            invest.Image = imageName;

            return await _investRepo.AddContract(invest);

        }

        public async Task<bool> AddPaymentAsync(PaymentDto paymentDto, int investmentId)
        {
            var invest = await _investRepo.GetByIdAsync(investmentId);
            if (invest == null) return false;
        

            invest.CardNumber = paymentDto.CardNumber;
            invest.CVV = paymentDto.CVV;
            invest.ExpiryDate = paymentDto.ExpiryDate;
            invest.PaymentMethod = paymentDto.PaymentMethod;
            invest.CompletePayment= true;

            return await _investRepo.AddContract(invest);

        }

        private async Task<decimal> CalculateMinimumInvestmentAsync(int projectId)
        {
            var project = await _projectRepo.GetByIdAsync(projectId);

            if (project?.FundingDetails == null)
                throw new InvalidOperationException("Funding details not found for this project.");

            decimal min = project.FundingDetails.NextRoundFunding * 0.15m;
            return min;
        }



        private async Task<decimal> CalculateMaximumInvestmentAsync(int projectId)
        {
            var project = await _projectRepo.GetByIdAsync(projectId);

            if (project?.FundingDetails == null)
                throw new InvalidOperationException("Funding details not found for this project.");

            decimal max = project.FundingDetails.NextRoundFunding * 0.25m;
            return max;
        }
    }

}
