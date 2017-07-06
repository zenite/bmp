	INSERT dbo.AppUser
	        ( Id ,
	          Account ,
	          Password ,
	          UserName ,
	          EmailAddress ,
	          LangName ,
			  [Language],
	          CellPhone ,
	          IsActive ,
	          IsDeleted ,
	          CreationTime
	        )
	VALUES  ( N'1' , -- Id - nvarchar(50)
	          N'admin' , -- Account - nvarchar(50)
	          N'ISMvKXpXpadDiUoOSoAfww==' , -- Password - nvarchar(50)
	          N'admin' , -- UserName - nvarchar(50)
	          N'admin' , -- EmailAddress - nvarchar(50)
	          N'4bb08541-57d7-44a2-a412-1d538c3c7931' , -- LangName - nvarchar(50)
	          N'zh-CN', -- IsActive - int
	          N'13333333333' , -- CellPhone - nvarchar(50)
	          1 , -- IsActive - int
	          0 , -- IsDeleted - int
	          GETDATE()  -- CreationTime - datetime
	        )



	INSERT dbo.AppLanguage
	        ( Id ,
	          [Key] ,
	          Value ,
	          LanguageCulture ,
	          LastModificationTime
	        )
	VALUES  ( N'4bb08541-57d7-44a2-a412-1d538c3c7931' , -- Id - nvarchar(50)
	          N'4bb08541-57d7-44a2-a412-1d538c3c7931' , -- Key - nvarchar(256)
	          N'管理员' , -- Value - nvarchar(256)
	          N'zh-CN' , -- LanguageCulture - nvarchar(50)
	          GETDATE()  -- LastModificationTime - datetime
	        )

	INSERT dbo.AppLanguage
	        ( Id ,
	          [Key] ,
	          Value ,
	          LanguageCulture ,
	          LastModificationTime
	        )
	VALUES  ( N'589adc9d-df75-4fe3-8bf3-e31eb2149a33' , -- Id - nvarchar(50)
	          N'4bb08541-57d7-44a2-a412-1d538c3c7931' , -- Key - nvarchar(256)
	          N'administrator' , -- Value - nvarchar(256)
	          N'en' , -- LanguageCulture - nvarchar(50)
	          GETDATE()  -- LastModificationTime - datetime
	        )