using StartUP.Data.Entity;
using Microsoft.EntityFrameworkCore;
using StartUP.Data.Context;
using StartUP.Repository.UserRepo;

public class UserRepo : IUserRepo
{
    private readonly StartUPContext _context;

    public UserRepo(StartUPContext context)
    {
        _context = context;
    }

    public async Task AddUserAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<User>> GetAllInvestorAsync()
    {
        return await _context.Users.Where(u => u.Role == "Investor").ToListAsync();
    }


    public async Task<IEnumerable<User>> GetAllOwnerAsync()
    {
        return await _context.Users.Where(u => u.Role == "Owner").ToListAsync();
    }

    public async Task<IEnumerable<User>> GetAllUserAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetUserByUserNameAsync(string userName)
    {
        return await _context.Users.Include(u => u.Projects).Include(u => u.Investments).FirstOrDefaultAsync(u => u.UserName == userName);
    }


    public async Task UpdateUserAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteUserAsync(User user)
    {
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<User>> GetPendingUsers()
    {
        return await _context.Users.Where(u => u.IsActive == false).ToListAsync();
    }

    public async Task<User> GetByEmailAndUserNameAsync(string email, string username)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.UserName == username);
    }

    public async Task<int> GetTotalInvestorsCountAsync()
    {
        return await _context.Users.CountAsync(u => u.Role == "Investor");
    }
    public async Task<int> GetTotalUsersAsync()
    {
        return await _context.Set<User>().CountAsync();  // حساب عدد المستخدمين
    }

    public async Task<(int OwnersCount, int InvestorsCount)> GetOwnersAndInvestorsCountAsync()
    {
        var ownersCount = await _context.Set<User>()
            .Where(u => u.Role.ToLower() == "owner" ) 
            .CountAsync();

        var investorsCount = await _context.Set<User>()
            .Where(u => u.Role.ToLower() == "investor" )
            .CountAsync();

        return (ownersCount, investorsCount);
    }
    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users.Include(u => u.Projects).Include(u => u.Investments).FirstOrDefaultAsync(u => u.Id == id);
    }

}




