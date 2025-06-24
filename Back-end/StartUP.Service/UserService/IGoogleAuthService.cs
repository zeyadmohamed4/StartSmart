using StartUP.Service.Dtos.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace StartUP.Service.UserService
{
    public interface IGoogleAuthService
    {
        Task<(bool Success, string Message, GoogleLoginDto Data)> HandleGoogleLoginAsync(string email, string username);
    }
}
