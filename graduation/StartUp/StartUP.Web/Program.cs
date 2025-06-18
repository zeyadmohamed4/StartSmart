using Microsoft.AspNetCore.Authentication.Google;
using StartUP.Data.Context;
using Microsoft.EntityFrameworkCore;
using StartUP.Repository.UserRepo;
using StartUP.Service.UserService;
using StartUP.Repository.FeedBackRepo;
using StartUP.Repository.SuccessStoryRepo;
using StartUP.Repository.ProjectRepo;
using StartUP.Service.FeedBackService;
using StartUP.Service.ProjectService;
using StartUP.Service.SuccessStoryService;
using StartUP.Service.InvestmentService;
using StartUP.Repository.InvestmentRepo;
using StartUP.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNetCore.Authentication.Cookies;
using StartUP.Service.ProjectDetailsService;
using API.Extentions;
using StartUP.Service.InvestmentPredectionService;
using StartUP.Service;
using StartUP.Repository;
using System;
using StartUP.Repository.Contract;
using StartUP.Service.Contract;
using StartUP.Service.ContractService;
using StartUP.Service.PredictionService;

namespace StartUP.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // إضافة Authentication
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
            })
            .AddCookie()
            .AddGoogle(googleOptions =>
            {
                googleOptions.ClientId = "998046837274-bsncedgp9jfhn1mju7s7vcif507n3a5a.apps.googleusercontent.com";
                googleOptions.ClientSecret = "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";
            });

            // Add services to the container.
            builder.Services.AddHttpClient();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin", builder =>
                {
                    builder
                        .WithOrigins("http://localhost:3000") // Allow requests from this origin
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });
            builder.Services.AddControllers();
            builder.Services.AddDbContext<StartUPContext>(optionsAction: options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });


            builder.Services.AddHttpContextAccessor();

            builder.Services.AddScoped<TokenService>();
            builder.Services.AddScoped<IUserRepo, UserRepo>();
            builder.Services.AddScoped<IUserServicecs, UserService>();
            builder.Services.AddScoped<ISuccessStoryRepository, SuccessStoryRepository>();
            builder.Services.AddScoped<ISuccessStoryService, SuccessStoryService>();
            builder.Services.AddScoped<IFeedBackRepo, FeedBackRepo>();
            builder.Services.AddScoped<IFeedBackService, FeedBackService>();
            builder.Services.AddScoped<IProjecRepo, ProjectRepository>();
            builder.Services.AddScoped<IProjectService, ProjectService>();
            builder.Services.AddScoped<IProjectDetailsRepo, ProjectDetailsRepo>();
            builder.Services.AddScoped<IProjectDetails, ProjectDetailsService>();
            builder.Services.AddScoped<IInvestmentRepo, InvestmentRepo>();
            builder.Services.AddScoped<IInvestmentService, InvestmentService>();
            builder.Services.AddScoped<IGoogleAuthService, GoogleAuthService>();
            builder.Services.AddScoped<IGoogleLoginRepository, GoogleLoginRepository>();
            builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
            builder.Services.AddScoped<INotificationService, NotificationService>();
            builder.Services.AddScoped<IContractRepository, ContractRepository>();
            builder.Services.AddScoped<IContractService, ContractService>();
            builder.Services.AddScoped<IPredictionService, PredictionService>();


            
            builder.Services.AddAutoMapper(typeof(ProjectProfile));
            builder.Services.AddAutoMapper(typeof(InvestmentProfile));
            builder.Services.AddAutoMapper(typeof(MappingProfile));
            builder.Services.AddAutoMapper(typeof(InvestmentPredictionProfile));

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddCustomJwtAuth(builder.Configuration);

            var app = builder.Build();
            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<StartUPContext>();
                DbInitializer.InitializeAsync(context).GetAwaiter().GetResult();
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseStaticFiles();

            app.UseCors("AllowSpecificOrigin");
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}