# ── Stage 1: build (SDK image — только для сборки, не в финальный image) ──

# Base image с .NET 8 SDK (compile + publish)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Рабочая папка внутри build-container
WORKDIR /src

# Сначала только .csproj → layer с NuGet restore кэшируется, если код не менялся
COPY ["MercantecApi.csproj", "./"]

# Скачать зависимости (Swashbuckle и т.д.)
RUN dotnet restore "MercantecApi.csproj"

# Остальной исходный код (build context = эта папка)
COPY . .

# Собрать Release и положить результат в /app/publish
RUN dotnet publish "MercantecApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ── Stage 2: runtime (маленький image — только aspnet, без SDK) ──

# Лёгкий runtime-image для запуска (меньше размер, без компилятора)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

# Папка, откуда стартует app
WORKDIR /app

# Документируем порт (открывает `-p` при docker run, не сам EXPOSE)
EXPOSE 8080

# Kestrel слушает 8080 на всех interfaces внутри container
ENV ASPNETCORE_URLS=http://+:8080

# Production — без Swagger; HTTPS снаружи делает Cloudflare + nginx
ENV ASPNETCORE_ENVIRONMENT=Production

# Скопировать только publish из build-stage (не bin/obj исходников)
COPY --from=build /app/publish .

# Команда при старте container
CMD ["dotnet", "MercantecApi.dll"]
