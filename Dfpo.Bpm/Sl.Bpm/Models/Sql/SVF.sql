CREATE FUNCTION L(@Key NVARCHAR(50), @LanguageCulture NVARCHAR(50))
RETURNS NVARCHAR(256)
AS
BEGIN 
DECLARE @LangValue NVARCHAR(256) 
SELECT @LangValue =  [Value]  FROM dbo.AppLanguage l WHERE l.LanguageCulture = @LanguageCulture AND [Key] = @Key
RETURN @LangValue
END 
