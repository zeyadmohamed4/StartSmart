using StartUP.Data.Entity;
using StartUP.Repository.UserRepo;
using StartUP.Service.Dtos.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.UserService
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly IGoogleLoginRepository _googleLoginRepo;
        private readonly IUserRepo _userRepo;

        public GoogleAuthService(IGoogleLoginRepository googleLoginRepo, IUserRepo userRepo)
        {
            _googleLoginRepo = googleLoginRepo;
            _userRepo = userRepo;
        }

        public async Task<(bool Success, string Message, GoogleLoginDto Data)> HandleGoogleLoginAsync(string email, string username)
        {
            // تحقق من وجود المستخدم في GoogleLogins
            var existingGoogleUser = await _googleLoginRepo.GetByEmailAsync(email);
            if (existingGoogleUser == null)
            {
                await _googleLoginRepo.AddAsync(new GoogleLogin
                {
                    Email = email,
                    UserName = username
                });
            }

            // تحقق من وجود المستخدم في جدول Users
            var appUser = await _userRepo.GetByEmailAndUserNameAsync(email, username);
            if (appUser == null)
            {
                return (false, "😬 Google account is saved, but there's no matching user account.", new GoogleLoginDto { Email = email, UserName = username });
            }

            return (true, "🎉 Google login successful and matched with registered user!", new GoogleLoginDto { Email = email, UserName = username });
        }
    }
}
