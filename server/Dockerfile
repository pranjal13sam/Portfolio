FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy everything from server folder
COPY . .

# Move into project folder
WORKDIR /src/Portfolio.Api

RUN dotnet publish Portfolio.Api.csproj -c Release -o /app

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app .

EXPOSE 8080
ENTRYPOINT ["dotnet", "Portfolio.Api.dll"]