using StartUP.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Repository.UserRepo
{
    public interface IUserRepo
    {
        Task AddUserAsync(User user);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByUserNameAsync(string userName);
        Task<IEnumerable<User>> GetPendingUsers();
        Task<IEnumerable<User>> GetAllUserAsync();
        Task<IEnumerable<User>> GetAllOwnerAsync();
        Task<IEnumerable<User>> GetAllInvestorAsync();
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(User user);

        Task<User> GetByEmailAndUserNameAsync(string email, string username);

        Task<int> GetTotalInvestorsCountAsync();
        Task<int> GetTotalUsersAsync();

        Task<(int OwnersCount, int InvestorsCount)> GetOwnersAndInvestorsCountAsync();
        Task UpdateAsync(User user);
        Task<User?> GetByIdAsync(int id);

 
    }
}
