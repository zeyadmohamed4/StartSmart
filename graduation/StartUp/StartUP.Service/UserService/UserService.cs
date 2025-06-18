using StartUP.Data.Entity;
using StartUP.Repository.UserRepo;
using System.Net.Mail;
using System.Net;

using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;
using StartUP.Service.Dtos.User;
using Microsoft.AspNetCore.Http;

namespace StartUP.Service.UserService
{
    public class UserService : IUserServicecs
    {
        private readonly IUserRepo _userRepo;
        private readonly TokenService _tokenService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserService(IUserRepo userRepo, TokenService tokenService ,  IHttpContextAccessor  httpContextAccessor)
        {
            _userRepo = userRepo;
            _tokenService = tokenService;
            _httpContextAccessor = httpContextAccessor;
        }


        public async Task<bool> RegisterUserAsync(UserDto userDto)
        {
            var existingUser = await _userRepo.GetUserByEmailAsync(userDto.Email);
            if (existingUser != null)
            {
                return false;
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            // حفظ الصورة في مجلد داخل المشروع
            string imageName = null;
            if (userDto.Image != null && userDto.Image.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                Directory.CreateDirectory(uploadsFolder); // يتأكد إن المجلد موجود
                imageName = Guid.NewGuid().ToString() + Path.GetExtension(userDto.Image.FileName);
                var filePath = Path.Combine(uploadsFolder, imageName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await userDto.Image.CopyToAsync(stream);
                }
            }

            var user = new User
            {
                Name = userDto.Name,
                UserName = userDto.UserName,
                Email = userDto.Email,
                Password = hashedPassword,
                SSN = userDto.SSN,
                Image = imageName, // اسم الصورة فقط
                PhoneNumber = userDto.PhoneNumber,
                Role = userDto.Role,
                LinkedIn = userDto.LinkedIn,
                Country = userDto.Country,
                City = userDto.City
            };

            await _userRepo.AddUserAsync(user);
            return true;
        }



        public async Task<LoginResult> LoginUserAsync(LoginDto loginDto)
        {
            var user = await _userRepo.GetUserByEmailAsync(loginDto.Email);

            if (user == null)
            {
                return new LoginResult
                {
                    Success = false,
                    Message = "Oops! 😅 We couldn't find an account with that email. Wanna sign up?"
                };
            }

            if (!user.IsActive)
            {
                return new LoginResult
                {
                    Success = false,
                    Message = "⏳ Your account isn't activated yet."
                };
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password);
            if (!isPasswordValid)
            {
                return new LoginResult
                {
                    Success = false,
                    Message = "😬 Incorrect password. Try again or reset it if you've forgotten!"
                };
            }

            string token = _tokenService.GenerateToken(user.Id, user.UserName, user.Role);
            return new LoginResult
            {
                Success = true,
                Token = token,
                Message = "🎉 Login successful! Welcome back 🚀"
            };
        }



        public async Task<IEnumerable<UserResponsDto>> GetAllUserAsync()
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";
            var users = await _userRepo.GetAllUserAsync();
            return users.Select(u => new UserResponsDto
            {
                Name = u.Name,
                UserName = u.UserName,
                Email = u.Email,
                SSN = u.SSN,
                Image = string.IsNullOrEmpty(u.Image) ? null: $"{baseUrl}/images/{u.Image}",
                PhoneNumber = u.PhoneNumber,
                Role = u.Role,
                LinkedIn = u.LinkedIn,
                City = u.City,
                Country = u.Country,

            });
        }

        public async Task<IEnumerable<UserResponsDto>> GetAllOwnerAsync()
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";

            var owners = await _userRepo.GetAllOwnerAsync();
            return owners.Select(u => new UserResponsDto
            {
                Name = u.Name,
                UserName = u.UserName,
                Email = u.Email,
                SSN = u.SSN,
                Image = string.IsNullOrEmpty(u.Image) ? null : $"{baseUrl}/images/{u.Image}",
                PhoneNumber = u.PhoneNumber,
                Role = u.Role,
                LinkedIn = u.LinkedIn,
                City = u.City,
                Country = u.Country,

            });
        }

        public async Task<IEnumerable<UserResponsDto>> GetAllInvestorAsync()
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";

            var investors = await _userRepo.GetAllInvestorAsync();
            return investors.Select(u => new UserResponsDto
            {
                Name = u.Name,
                UserName = u.UserName,
                Email = u.Email,
                SSN = u.SSN,
                Image = string.IsNullOrEmpty(u.Image) ? null : $"{baseUrl}/images/{u.Image}",

                PhoneNumber = u.PhoneNumber,
                Role = u.Role,
                LinkedIn = u.LinkedIn,
                City = u.City,
                Country = u.Country,

            });
        }

        public async Task<string> ResetPasswordAsync(string email)
        {
            var user = await _userRepo.GetUserByEmailAsync(email);
            if (user == null)
            {
                return null;
            }

            string newPassword = GenerateRandomPassword();
            user.Password = newPassword; // Ideally, hash the password before storing.89333
                                         // it
            await _userRepo.UpdateUserAsync(user);

            SendEmail(user.Email, "Password Reset", $"Your new password is: {newPassword}");

            return newPassword;
        }

        private string GenerateRandomPassword(int length = 12)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!";
            StringBuilder password = new StringBuilder();
            using (var rng = new RNGCryptoServiceProvider())
            {
                byte[] buffer = new byte[length];
                rng.GetBytes(buffer);
                for (int i = 0; i < length; i++)
                {
                    password.Append(chars[buffer[i] % chars.Length]);
                }
            }
            return password.ToString();
        }

        private void SendEmail(string toEmail, string subject, string body)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("startsmartgp@gmail.com", "cjma guph yfal fdqm"),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("startsmartgp@gmail.com"),
                Subject = subject,
                Body = body,
                IsBodyHtml = false,
            };
            mailMessage.To.Add(toEmail);

            smtpClient.Send(mailMessage);
        }
        public async Task<IEnumerable<UserResponsDto>> GetPendingUserAsync()
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";

            var users = await _userRepo.GetPendingUsers();
            return users.Select(u => new UserResponsDto
            {
                Name = u.Name,
                UserName = u.UserName,
                Email = u.Email,
                SSN = u.SSN,
                Image = string.IsNullOrEmpty(u.Image) ? null : $"{baseUrl}/images/{u.Image}",
                PhoneNumber = u.PhoneNumber,
                Role = u.Role,
                LinkedIn = u.LinkedIn,
                City = u.City,
                Country = u.Country,
                Status = u.IsActive ? "Active" : "Pending"
            });
        }



        public async Task<bool> AcceptUser(AcceptUserDto acceptUserDto)
        {
            var user = await _userRepo.GetUserByUserNameAsync(acceptUserDto.UserName);
            if (user == null) throw new Exception("User not found");
            user.IsActive = true;
            await _userRepo.UpdateUserAsync(user);
            return true;

        }


        public async Task<bool> RejectUser(AcceptUserDto acceptUserDto)
        {
            var user = await _userRepo.GetUserByUserNameAsync(acceptUserDto.UserName);
            if (user == null) throw new Exception("User not found");
            await _userRepo.DeleteUserAsync(user);
            return true;

        }

        public async Task<int> GetTotalInvestorsCountAsync()
        {
            return await _userRepo.GetTotalInvestorsCountAsync();
        }

        public async Task<int> GetTotalUsersAsync()
        {
            return await _userRepo.GetTotalUsersAsync();
        }

        public async Task<(int OwnersCount, int InvestorsCount)> GetOwnersAndInvestorsCountAsync()
        {
            return await _userRepo.GetOwnersAndInvestorsCountAsync();
        }

        public async Task<OwnerProfileDto> GetOwnerProfileAsync(string userName)
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";

            var user = await _userRepo.GetUserByUserNameAsync(userName);

            if (user == null)
                return null;

            return new OwnerProfileDto
            {
                Image = string.IsNullOrEmpty(user.Image) ? null : $"{baseUrl}/images/{user.Image}",
                UserName = user.UserName,
                Name = user.Name,
                Projects = user.Projects.Count(),
                Role = user.Role,
                PhoneNumber = user.PhoneNumber
            };
        }

        public async Task<InvestorProfileDto> GetInvestorProfileAsync(string userName)
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";

            var user = await _userRepo.GetUserByUserNameAsync(userName);

            if (user == null)
                return null;

            return new InvestorProfileDto
            {
                Image = string.IsNullOrEmpty(user.Image) ? null : $"{baseUrl}/images/{user.Image}",
                UserName = user.UserName,
                Name = user.Name,
                Investments = user.Investments.Count(),
                Role = user.Role,
                PhoneNumber = user.PhoneNumber
            };
        }

        public async Task<BasicInfoDto> GetBasicInfoAsync(string userName)
        {
            var user = await _userRepo.GetUserByUserNameAsync(userName);

            if (user == null)
                return null;

            return new BasicInfoDto
            {
                Email = user.Email,
                Location= user.Country +" ,"+user.City,
                LinkedIn = user.LinkedIn,
                Education = user.Education,
                Experience  = user.Experience,
                PreviousVentures = user.PreviousVenture,
                UserId= user.Id


            };
        }

        public async Task<UserProfessionalDto> UpdateAsync(string userName, UserProfessionalDto dto)
        {
            var entity = await _userRepo.GetUserByUserNameAsync(userName);
            if (entity != null)
            {
                entity.Experience = dto.Experience;
                entity.PreviousVenture = dto.PreviousVenture;
                entity.Education = dto.Education;

                await _userRepo.UpdateAsync(entity);

                // إرجاع البيانات المحدثة
                return new UserProfessionalDto
                {
                    Experience = entity.Experience,
                    PreviousVenture = entity.PreviousVenture,
                    Education = entity.Education
                };
            }
            return null;
        }

    }
}