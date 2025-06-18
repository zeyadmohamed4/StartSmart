using Microsoft.AspNet.Identity;
using StartUP.Data.Entity;
using StartUP.Repository.UserRepo;
using StartUP.Service.Dtos.User;
using StartUP.Service.FeedBackService;
using StartUP.Service.ProjectService;
using StartUP.Service.SuccessStoryService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.UserService
{
    public interface IUserServicecs
    {
        Task<bool> RegisterUserAsync(UserDto userDto);
        Task<LoginResult> LoginUserAsync(LoginDto loginDto);
        Task<IEnumerable<UserResponsDto>> GetPendingUserAsync();
        Task<IEnumerable<UserResponsDto>> GetAllUserAsync();
        Task<IEnumerable<UserResponsDto>> GetAllOwnerAsync();
        Task<IEnumerable<UserResponsDto>> GetAllInvestorAsync();
        Task<string> ResetPasswordAsync(string email);
        Task<bool> AcceptUser(AcceptUserDto acceptUserDto);
        Task<bool> RejectUser(AcceptUserDto acceptUserDto);

        Task<int> GetTotalInvestorsCountAsync();
        Task<int> GetTotalUsersAsync();

        Task<(int OwnersCount, int InvestorsCount)> GetOwnersAndInvestorsCountAsync();

        Task<OwnerProfileDto> GetOwnerProfileAsync(string userName);
        Task<InvestorProfileDto> GetInvestorProfileAsync(string userName);
        Task<BasicInfoDto> GetBasicInfoAsync(string userName);

        Task<UserProfessionalDto> UpdateAsync(string userName, UserProfessionalDto dto);




    }
}

