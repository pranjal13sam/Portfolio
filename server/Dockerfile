# ---------- Build Stage ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy server code
COPY server ./server

# Go into project folder
WORKDIR /src/server/Portfolio.Api

# Publish the project explicitly
RUN dotnet publish Portfolio.Api.csproj -c Release -o /app

# ---------- Runtime Stage ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app .

ENTRYPOINT ["dotnet", "Portfolio.Api.dll"]