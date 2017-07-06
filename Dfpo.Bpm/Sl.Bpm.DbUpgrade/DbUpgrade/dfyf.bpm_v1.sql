/*
	2016/7/10 DFYF.BPM 第一次发布 版本号 v1.0
	初次生成数据库的结构脚本
*/
CREATE TABLE [dbo].[AppAuditLog] (
    [Id] [nvarchar](50) NOT NULL,
    [UserId] [nvarchar](50),
    [ServiceName] [nvarchar](256),
    [MethodName] [nvarchar](256),
    [RequestJson] [nvarchar](max),
    [ResponseJson] [nvarchar](max),
    [ExecutionTime] [datetime] NOT NULL,
    [Duration] [int] NOT NULL,
    [ClientIpAddress] [nvarchar](64),
    [ClientName] [nvarchar](128),
    [BrowserInfo] [nvarchar](256),
    [Exception] [nvarchar](max),
    CONSTRAINT [PK_dbo.AppAuditLog] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[AppBusinessTable] (
    [Id] [nvarchar](50) NOT NULL,
    [Type] [int] NOT NULL,
    [SchemaName] [nvarchar](100),
    [AliasName] [nvarchar](100),
    [DisplayOrder] [int] NOT NULL,
    [LangName] [nvarchar](50),
    [LangDescription] [nvarchar](2000),
    [ParentBusinessTableId] [nvarchar](50),
    [EnterpriseId] [nvarchar](50),
    [DeletionTime] [datetime],
    [DeleterUserId] [nvarchar](50),
    [IsDeleted] [bit] NOT NULL,
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.AppBusinessTable] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[AppBusinessTableColumn] (
    [Id] [nvarchar](50) NOT NULL,
    [LangName] [nvarchar](50),
    [SchemaName] [nvarchar](50) NOT NULL,
    [Type] [int] NOT NULL,
    [MaxLength] [int] NOT NULL,
    [IsRequired] [bit] NOT NULL,
    [DisplayOrder] [int],
    [BusinessTableId] [nvarchar](max) NOT NULL,
    [EnterpriseId] [nvarchar](max) NOT NULL,
    [Memo] [nvarchar](max),
    [Alignment] [nvarchar](50),
    [IsDisplayEnable] [bit] NOT NULL,
    [IsLinkEnable] [bit] NOT NULL,
    [IsWhereEnable] [bit] NOT NULL,
    [IsOrderByEnable] [bit] NOT NULL,
    [IsGroupByEnable] [bit] NOT NULL,
    [IsAggregateEnable] [bit] NOT NULL,
    [WhereInputType] [nvarchar](100),
    [WhereInputContent] [nvarchar](500),
    CONSTRAINT [PK_dbo.AppBusinessTableColumn] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[AppBusinessTableColumnChangeHistory] (
    [Id] [nvarchar](50) NOT NULL,
    [OperationType] [int] NOT NULL,
    [SchemaName] [nvarchar](50) NOT NULL,
    [SchemaNameOld] [nvarchar](50),
    [Type] [int] NOT NULL,
    [MaxLength] [int] NOT NULL,
    [IsRequired] [bit] NOT NULL,
    [IsApplied] [bit] NOT NULL,
    [BusinessTableId] [nvarchar](50),
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.AppBusinessTableColumnChangeHistory] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[AppEnterprise] (
    [Id] [nvarchar](50) NOT NULL,
    [LangName] [nvarchar](100),
    [Code] [nvarchar](100),
    [Address] [nvarchar](100),
    [Contact] [nvarchar](100),
    [CellPhone] [nvarchar](100),
    [Email] [nvarchar](100),
    [Memo] [nvarchar](500),
    [IsActive] [bit],
    [IsDeleted] [bit] NOT NULL,
    [DisplayOrder] [int],
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    [ServiceAddress] [nvarchar](max),
    [AccessId] [nvarchar](50),
    [DefaultLanguage] [nvarchar](10),
    CONSTRAINT [PK_dbo.AppEnterprise] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[AppEnterpriseLanguage] (
    [Id] [nvarchar](50) NOT NULL,
    [EnterpriseId] [nvarchar](50),
    [LanguageCode] [nvarchar](50),
    CONSTRAINT [PK_dbo.AppEnterpriseLanguage] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[AppEnterpriseSetting] (
    [Id] [nvarchar](50) NOT NULL,
    [Name] [nvarchar](500) NOT NULL,
    [Value] [nvarchar](4000) NOT NULL,
    [EnterpriseId] [nvarchar](50),
    [WfdWorkflowId] [nvarchar](50),
    CONSTRAINT [PK_dbo.AppEnterpriseSetting] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[AppEnterpriseUser] (
    [Id] [nvarchar](50) NOT NULL,
    [EnterpriseId] [nvarchar](50),
    [UserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.AppEnterpriseUser] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[AppLanguage] (
    [Id] [nvarchar](50) NOT NULL,
    [Key] [nvarchar](512),
    [Value] [nvarchar](512),
    [LanguageCulture] [nvarchar](50) NOT NULL,
    [EnterpriseId] [nvarchar](50),
    CONSTRAINT [PK_dbo.AppLanguage] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[AppUser] (
    [Id] [nvarchar](50) NOT NULL,
    [IsOut] [bit],
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    [IsSuperAdmin] [bit] NOT NULL,
    [Gender] [bit],
    [EmployeeNumber] [nvarchar](50),
    [Telephone] [nvarchar](50),
    [Account] [nvarchar](50),
    [Password] [nvarchar](128),
    [LangName] [nvarchar](50),
    [Language] [nvarchar](50),
    [EmailAddress] [nvarchar](50),
    [CellPhone] [nvarchar](50),
    [IsActive] [bit] NOT NULL,
    [InitialPassword] [nvarchar](50),
    [IsAlreadyActivated] [bit] NOT NULL,
    [AccessId] [nvarchar](50),
    [ErrorLoginTimes] [int] NOT NULL,
    [LastErrorLoginTime] [datetime],
    [PhoneConfirmationCode] [nvarchar](50),
    [EmailConfirmationCode] [nvarchar](50),
    [IsPhoneConfirmed] [bit] NOT NULL,
    [IsEmailConfirmed] [bit] NOT NULL,
    [NickName] [nvarchar](50),
    [Birthday] [datetime],
    [Location] [nvarchar](100),
    [LastModificationTime] [datetime],
    [DeletionTime] [datetime],
    [DeleterUserId] [nvarchar](50),
    [IsDeleted] [bit] NOT NULL,
    CONSTRAINT [PK_dbo.AppUser] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmBasicData] (
    [Id] [nvarchar](50) NOT NULL,
    [LangName] [nvarchar](50),
    [Value] [nvarchar](50),
    [Description] [nvarchar](500),
    [IsDisabled] [bit] NOT NULL,
    [ParentId] [nvarchar](50),
    [EnterpriseId] [nvarchar](50),
    [DisplayOrder] [int] NOT NULL,
    CONSTRAINT [PK_dbo.BpmBasicData] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmEnum] (
    [Id] [nvarchar](50) NOT NULL,
    [LangName] [nvarchar](512),
    [Value] [nvarchar](512),
    [Enum] [nvarchar](512),
    [DisplayOrder] [int],
    [EnterpriseId] [nvarchar](100),
    CONSTRAINT [PK_dbo.BpmEnum] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmGroup] (
    [Id] [nvarchar](50) NOT NULL,
    [LangName] [nvarchar](200),
    [ParentGroupId] [nvarchar](100),
    [EnumGroupType] [nvarchar](100),
    [Area] [nvarchar](100),
    [Memo] [nvarchar](1000),
    [DisplayOrder] [int],
    [Code] [nvarchar](50),
    [EnumGroupLevel] [nvarchar](20),
    [EnterpriseId] [nvarchar](100),
    [IsRoot] [bit],
    CONSTRAINT [PK_dbo.BpmGroup] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmInformTemplate] (
    [Id] [nvarchar](50) NOT NULL,
    [Type] [int] NOT NULL,
    [Content] [nvarchar](max),
    [EnterpriseId] [nvarchar](50),
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.BpmInformTemplate] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmInterfaceConfig] (
    [Id] [nvarchar](50) NOT NULL,
    [ServerId] [nvarchar](50),
    [Name] [nvarchar](50),
    [ProcessType] [int] NOT NULL,
    [FileFormat] [nvarchar](50),
    [LoopType] [int] NOT NULL,
    [ExecTime] [nvarchar](10),
    [StartTime] [datetime],
    [IntervalSecond] [int] NOT NULL,
    [CallBackMethod] [nvarchar](max),
    [EnterpriseId] [nvarchar](50),
    [BusinessTableId] [nvarchar](50),
    [FileColumns] [nvarchar](max),
    [KeyColumns] [nvarchar](max),
    [IsEnable] [bit] NOT NULL,
    CONSTRAINT [PK_dbo.BpmInterfaceConfig] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmInterfaceMappingConfig] (
    [Id] [nvarchar](50) NOT NULL,
    [InterfaceConfigId] [nvarchar](50),
    [MappingOrder] [int] NOT NULL,
    [DataField] [nvarchar](50),
    [IsPrimaryField] [bit] NOT NULL,
    [DataType] [int] NOT NULL,
    [IsEnable] [bit] NOT NULL,
    CONSTRAINT [PK_dbo.BpmInterfaceMappingConfig] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmInterfaceServerConfig] (
    [Id] [nvarchar](50) NOT NULL,
    [Type] [int] NOT NULL,
    [Name] [nvarchar](50),
    [Address] [nvarchar](50),
    [Account] [nvarchar](50),
    [Password] [nvarchar](50),
    [EnterpriseId] [nvarchar](50),
    [Port] [int] NOT NULL,
    CONSTRAINT [PK_dbo.BpmInterfaceServerConfig] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmJob] (
    [Id] [nvarchar](50) NOT NULL,
    [Code] [nvarchar](50),
    [LangName] [nvarchar](50),
    [EnumJobLevel] [nvarchar](50),
    [IsPrimary] [bit] NOT NULL,
    [IsLeader] [bit] NOT NULL,
    [GroupId] [nvarchar](50),
    [ParentJobId] [nvarchar](50),
    [DisplayOrder] [int],
    [IsRoot] [bit] NOT NULL,
    [EnterpriseId] [nvarchar](50),
    CONSTRAINT [PK_dbo.BpmJob] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmJobUser] (
    [Id] [nvarchar](50) NOT NULL,
    [JobId] [nvarchar](100),
    [UserId] [nvarchar](100),
    [EnterpriseId] [nvarchar](100),
    CONSTRAINT [PK_dbo.BpmJobUser] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmLanguage] (
    [Id] [nvarchar](50) NOT NULL,
    [Key] [nvarchar](512),
    [Value] [nvarchar](512),
    [LanguageCulture] [nvarchar](50) NOT NULL,
    [EntityId] [nvarchar](50),
    [EnterpriseId] [nvarchar](50),
    CONSTRAINT [PK_dbo.BpmLanguage] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmModule] (
    [Id] [nvarchar](50) NOT NULL,
    [LangName] [nvarchar](50),
    [LangDescription] [nvarchar](500),
    [Type] [int] NOT NULL,
    [IsEnable] [bit] NOT NULL,
    [DisplayOrder] [int],
    [DependOnModuleIds] [nvarchar](500),
    [StartUpError] [nvarchar](max),
    [WfdWorkflowId] [nvarchar](50),
    [EnterpriseId] [nvarchar](50),
    [IndexPageId] [nvarchar](50),
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.BpmModule] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmModuleFavourite] (
    [Id] [nvarchar](50) NOT NULL,
    [UserId] [nvarchar](50),
    [ModuleId] [nvarchar](50),
    [EnterpriseId] [nvarchar](50),
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.BpmModuleFavourite] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmModulePageRight] (
    [Id] [nvarchar](50) NOT NULL,
    [PageId] [nvarchar](50),
    [NodeId] [nvarchar](50),
    [Flag] [nvarchar](50),
    [OpenStatus] [int] NOT NULL,
    [Status] [nvarchar](20),
    CONSTRAINT [PK_dbo.BpmModulePageRight] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmModuleRight] (
    [Id] [nvarchar](50) NOT NULL,
    [ModuleId] [nvarchar](50),
    [Type] [int] NOT NULL,
    [Value] [nvarchar](max),
    [Right] [int] NOT NULL,
    CONSTRAINT [PK_dbo.BpmModuleRight] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmReport] (
    [Id] [nvarchar](50) NOT NULL,
    [LangName] [nvarchar](50),
    [LangDescription] [nvarchar](50),
    [Type] [int] NOT NULL,
    [DisplayOrder] [int],
    [ParentReportId] [nvarchar](50),
    [EnterpriseId] [nvarchar](50),
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.BpmReport] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmRole] (
    [Id] [nvarchar](50) NOT NULL,
    [LangName] [nvarchar](100),
    [DisplayOrder] [int],
    [EnterpriseId] [nvarchar](100),
    [ParentId] [nvarchar](50),
    [Code] [nvarchar](100),
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.BpmRole] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmRoleJob] (
    [Id] [nvarchar](50) NOT NULL,
    [RoleId] [nvarchar](100),
    [JobId] [nvarchar](100),
    [EnterpriseId] [nvarchar](100),
    [DisplayOrder] [int],
    CONSTRAINT [PK_dbo.BpmRoleJob] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmViewTable] (
    [Id] [nvarchar](50) NOT NULL,
    [SchemaName] [nvarchar](50),
    [DisplayOrder] [int],
    [LangName] [nvarchar](50),
    [LangDescription] [nvarchar](50),
    [DataSql] [nvarchar](max),
    [ParentViewTableId] [nvarchar](50),
    [EnterpriseId] [nvarchar](50),
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.BpmViewTable] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[BpmViewTableColumn] (
    [Id] [nvarchar](50) NOT NULL,
    [LangName] [nvarchar](50),
    [SchemaName] [nvarchar](50),
    [Type] [nvarchar](50),
    [Alignment] [nvarchar](50),
    [IsDisplayEnable] [bit] NOT NULL,
    [IsLinkEnable] [bit] NOT NULL,
    [WhereInputType] [nvarchar](max),
    [WhereInputContent] [nvarchar](max),
    [IsWhereEnable] [bit] NOT NULL,
    [IsOrderByEnable] [bit] NOT NULL,
    [IsGroupByEnable] [bit] NOT NULL,
    [IsAggregateEnable] [bit] NOT NULL,
    [DisplayOrder] [int],
    [IsDeleted] [bit] NOT NULL,
    [ViewTableId] [nvarchar](50),
    [EnterpriseId] [nvarchar](50),
    CONSTRAINT [PK_dbo.BpmViewTableColumn] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[InstAgent] (
    [Id] [nvarchar](50) NOT NULL,
    [UserId] [nvarchar](100),
    [WfdCategoryId] [nvarchar](100),
    [WfdWorkflowId] [nvarchar](100),
    [UseJob] [int],
    [FirstUserId] [nvarchar](100),
    [FirstJobId] [nvarchar](100),
    [SecondUserId] [nvarchar](100),
    [SecondJobId] [nvarchar](100),
    [StartDateTime] [datetime],
    [EndDateTime] [datetime],
    [Enable] [bit] NOT NULL,
    [Order] [int],
    [EnterpriseId] [nvarchar](100),
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.InstAgent] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[InstAttachment] (
    [Id] [nvarchar](50) NOT NULL,
    [TaskId] [nvarchar](50),
    [NodeId] [nvarchar](50),
    [FileLinkId] [nvarchar](50),
    [FileId] [nvarchar](50),
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.InstAttachment] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[InstDraft] (
    [Id] [nvarchar](50) NOT NULL,
    [ProcId] [nvarchar](50),
    [OwnerUserId] [nvarchar](50),
    [OwnerJobId] [nvarchar](50),
    [Topic] [nvarchar](200),
    [CreationTime] [datetime],
    [LastModificationTime] [datetime],
    [Priority] [int] NOT NULL,
    [FormData] [text],
    [FileData] [text],
    [Type] [int],
    [WfdWorkflowId] [nvarchar](50),
    [WfdCategoryId] [nvarchar](50),
    [EnterpriseId] [nvarchar](50),
    CONSTRAINT [PK_dbo.InstDraft] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[InstFile] (
    [Id] [nvarchar](50) NOT NULL,
    [Name] [nvarchar](200),
    [ContentType] [nvarchar](200),
    [ExtensionName] [nvarchar](200),
    [Path] [nvarchar](200),
    [IsDeleted] [bit] NOT NULL,
    [DeleterUserId] [nvarchar](max),
    [DeletionTime] [datetime],
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.InstFile] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[InstLanguage] (
    [Id] [nvarchar](50) NOT NULL,
    [Key] [nvarchar](50),
    [Value] [nvarchar](512),
    [LanguageCulture] [nvarchar](50) NOT NULL,
    [EnterpriseId] [nvarchar](50),
    CONSTRAINT [PK_dbo.InstLanguage] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[InstMail] (
    [Id] [nvarchar](50) NOT NULL,
    [FromUserId] [nvarchar](50),
    [ToUserId] [nvarchar](50),
    [ToMail] [nvarchar](500),
    [MailCc] [nvarchar](1000),
    [MailType] [int],
    [WfdWorkflowId] [nvarchar](50),
    [FromNodeName] [nvarchar](100),
    [ToNodeName] [nvarchar](100),
    [Memo] [nvarchar](max),
    [Subject] [nvarchar](200),
    [Body] [nvarchar](max),
    [Attachment] [nvarchar](200),
    [FormProcId] [nvarchar](50),
    [ProcId] [nvarchar](50),
    [TaskId] [nvarchar](50),
    [CreationTime] [datetime],
    [SendTime] [datetime],
    [SendStatus] [int],
    [EnterpriseId] [nvarchar](50),
    CONSTRAINT [PK_dbo.InstMail] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[InstProc] (
    [Id] [nvarchar](50) NOT NULL,
    [RefId] [int] NOT NULL IDENTITY,
    [TaskId] [nvarchar](50),
    [NodeType] [int],
    [WfdWorkflowNodeId] [nvarchar](50),
    [RecvTime] [datetime],
    [ProcTime] [datetime],
    [ProcUser] [nvarchar](50),
    [ProcJobId] [nvarchar](50),
    [ProcOwner] [nvarchar](50),
    [ProcOwnerJobId] [nvarchar](50),
    [Status] [int],
    [Note] [nvarchar](max),
    [LastInformTime] [datetime],
    [InformBeginTime] [datetime],
    [InformIntervalTime] [nvarchar](50),
    [OvertimeActionBeginTime] [decimal](18, 2),
    [FormFile] [nvarchar](200),
    [IsWating] [int],
    [ProcNodeUserOrder] [int],
    [ActionId] [nvarchar](50),
    [ActionLangName] [nvarchar](50),
    [Priority] [int],
    [WaitingDays] [int],
    [OverDateAutoExecute] [int],
    [Type] [int],
    [EnterpriseId] [nvarchar](50),
    CONSTRAINT [PK_dbo.InstProc] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[InstProcLink] (
    [Id] [nvarchar](50) NOT NULL,
    [TaskId] [nvarchar](50),
    [ProcIdFrom] [nvarchar](50),
    [ProcIdTo] [nvarchar](50),
    CONSTRAINT [PK_dbo.InstProcLink] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[InstSerial] (
    [Id] [nvarchar](50) NOT NULL,
    [Type] [nvarchar](50) NOT NULL,
    [Prefix] [nvarchar](50) NOT NULL,
    [Number] [int],
    [EnterpriseId] [nvarchar](50),
    CONSTRAINT [PK_dbo.InstSerial] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[InstShare] (
    [Id] [nvarchar](50) NOT NULL,
    [ShareUserId] [nvarchar](50),
    [TaskId] [nvarchar](50),
    [ShareTime] [datetime],
    [Reason] [nvarchar](200),
    [FormFile] [nvarchar](50),
    [EnterpriseId] [nvarchar](50),
    CONSTRAINT [PK_dbo.InstShare] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[InstTask] (
    [Id] [nvarchar](50) NOT NULL,
    [RefId] [int] NOT NULL IDENTITY,
    [WfdCategoryId] [nvarchar](50),
    [WfdWorkflowId] [nvarchar](50),
    [CreateBy] [nvarchar](50),
    [CreateByJobId] [nvarchar](50),
    [CreateByGroupId] [nvarchar](50),
    [ApplicantId] [nvarchar](50),
    [ApplicantJobId] [nvarchar](50),
    [ApplicantGroupId] [nvarchar](50),
    [CreationTime] [datetime],
    [FinishedTime] [datetime],
    [Priority] [int],
    [Status] [int],
    [ParentTaskId] [nvarchar](50),
    [Memo] [nvarchar](max),
    [ConnectTable] [nvarchar](500),
    [Site] [nvarchar](20),
    [Sn] [nvarchar](40),
    [Topic] [nvarchar](600),
    [RejectBy] [nvarchar](72),
    [ParentProcId] [nvarchar](50),
    [EnterpriseId] [nvarchar](50),
    [FormFieldsJson] [nvarchar](16),
    CONSTRAINT [PK_dbo.InstTask] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[InstTaskHeader] (
    [Id] [nvarchar](50) NOT NULL,
    [TaskId] [nvarchar](50),
    [LangApplicantName] [nvarchar](50),
    [ApplicantEmployeeNumber] [nvarchar](50),
    [LangApplicantDepartment] [nvarchar](50),
    [ApplicantContactNumber] [nvarchar](50),
    [ApplicantContactEmail] [nvarchar](100),
    [ApplicantId] [nvarchar](50),
    [ApplicantJobId] [nvarchar](50),
    [ApplicantGroupId] [nvarchar](50),
    [LangInitiatorName] [nvarchar](50),
    [InitiatorEmployeeNumber] [nvarchar](50),
    [LangInitiatorDepartment] [nvarchar](50),
    [InitiatorContactNumber] [nvarchar](50),
    [InitiatorContactEmail] [nvarchar](100),
    [InitiatorId] [nvarchar](50),
    [InitiatorJobId] [nvarchar](50),
    [InitiatorGroupId] [nvarchar](50),
    CONSTRAINT [PK_dbo.InstTaskHeader] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[InstTaskCopy] (
    [Id] [nvarchar](50) NOT NULL,
    [ToUserId] [nvarchar](100),
    [FromUserId] [nvarchar](100),
    [TaskId] [nvarchar](100),
    [ProcId] [nvarchar](100),
    [CreationTime] [datetime],
    [Reason] [nvarchar](400),
    [IsRead] [bit],
    [FormId] [nvarchar](100),
    [EnterpriseId] [nvarchar](100),
    CONSTRAINT [PK_dbo.InstTaskCopy] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[InstTaskMark] (
    [Id] [nvarchar](50) NOT NULL,
    [ByUserId] [nvarchar](100),
    [TaskId] [nvarchar](100),
    [CreationTime] [datetime],
    [Reason] [nvarchar](400),
    [IsMarked] [bit] NOT NULL,
    [EnterpriseId] [nvarchar](100),
    CONSTRAINT [PK_dbo.InstTaskMark] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[InstVariable] (
    [Id] [nvarchar](50) NOT NULL,
    [TaskId] [nvarchar](50),
    [VariableName] [nvarchar](50),
    [VariableValue] [nvarchar](max),
    CONSTRAINT [PK_dbo.InstVariable] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[WfdCategory] (
    [Id] [nvarchar](50) NOT NULL,
    [Code] [nvarchar](100),
    [LangType] [nvarchar](100),
    [LangName] [nvarchar](100),
    [DisplayOrder] [int] NOT NULL,
    [FromUserId] [nvarchar](max),
    [EnterpriseId] [nvarchar](50),
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.WfdCategory] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[AppPage] (
    [Id] [nvarchar](50) NOT NULL,
    [LangName] [nvarchar](50),
    [LangDescription] [nvarchar](2000),
    [TableIds] [nvarchar](500),
    [FileName] [nvarchar](50),
    [Type] [int] NOT NULL,
    [MobileHtml] [nvarchar](max),
    [MobileController] [nvarchar](max),
    [PcHtml] [nvarchar](max),
    [PcController] [nvarchar](max),
    [DisplayOrder] [int],
    [EnterpriseId] [nvarchar](50),
    [ParentPageId] [nvarchar](50),
    [IsDesignerGenerated] [bit] NOT NULL,
    [DeletionTime] [datetime],
    [DeleterUserId] [nvarchar](50),
    [IsDeleted] [bit] NOT NULL,
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.AppPage] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[WfdWorkflow] (
    [Id] [nvarchar](50) NOT NULL,
    [FromWorkflowId] [nvarchar](100),
    [Code] [nvarchar](100),
    [LangName] [nvarchar](100),
    [SnFormat] [nvarchar](50),
    [DisplayOrder] [int],
    [Memo] [nvarchar](500),
    [WfdCategoryId] [nvarchar](50),
    [Zoom] [float],
    [Width] [int],
    [Height] [int],
    [EnterpriseId] [nvarchar](50),
    [DeletionTime] [datetime],
    [DeleterUserId] [nvarchar](50),
    [IsDeleted] [bit] NOT NULL,
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.WfdWorkflow] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[WfdWorkflowLink] (
    [Id] [nvarchar](50) NOT NULL,
    [StartNodeId] [nvarchar](50),
    [EndNodeId] [nvarchar](50),
    [UseCondition] [bit],
    [ConditionValue] [nvarchar](500),
    [LangMemo] [nvarchar](500),
    [WfdWorkflowId] [nvarchar](50),
    [LineType] [nvarchar](20),
    [M] [real],
    [EnterpriseId] [nvarchar](50),
    CONSTRAINT [PK_dbo.WfdWorkflowLink] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[WfdWorkflowLinkPoint] (
    [Id] [nvarchar](50) NOT NULL,
    [WfdWorkflowLinkId] [nvarchar](100),
    [DisplayOrder] [int],
    [X] [real],
    [Y] [real],
    [WfdWorkflowId] [nvarchar](100),
    [EnterpriseId] [nvarchar](50),
    CONSTRAINT [PK_dbo.WfdWorkflowLinkPoint] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[WfdWorkflowNode] (
    [Id] [nvarchar](50) NOT NULL,
    [Type] [int],
    [Code] [nvarchar](200),
    [LangName] [nvarchar](200),
    [AppPageId] [nvarchar](50),
    [DisplayOrder] [int],
    [Memo] [nvarchar](1000),
    [IsEntryEnable] [bit],
    [EntryCondition] [nvarchar](2000),
    [ActionLinkId] [nvarchar](100),
    [ProcessType] [int],
    [ProcessorLinkId] [nvarchar](1000),
    [JumpTypeBinary] [nvarchar](200),
    [JumpNodeId] [nvarchar](1000),
    [CopyLinkId] [nvarchar](100),
    [InformLinkId] [nvarchar](100),
    [IsOvertimeInformEnable] [bit],
    [OvertimeBeginTime] [nvarchar](100),
    [OvertimeIntervalTime] [nvarchar](100),
    [OvertimeInformLinkId] [nvarchar](100),
    [IsOvertimeActionEnable] [bit],
    [OvertimeActionTime] [nvarchar](100),
    [OvertimeActionType] [int],
    [PreProcessorLinkId] [nvarchar](50),
    [IsExamineEnable] [bit],
    [ExamineStandardTime] [nvarchar](100),
    [AutoCallType] [int],
    [AutoCallValue] [nvarchar](1000),
    [SubWorkflowId] [nvarchar](1000),
    [WfdWorkflowId] [nvarchar](100),
    [X] [real],
    [Y] [real],
    [Width] [real] NOT NULL,
    [Height] [real] NOT NULL,
    [ShapeType] [int] NOT NULL,
    [ImageSrc] [nvarchar](1000),
    [EnterpriseId] [nvarchar](100),
    CONSTRAINT [PK_dbo.WfdWorkflowNode] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[WfdWorkflowNodeAction] (
    [Id] [nvarchar](50) NOT NULL,
    [Type] [nvarchar](100),
    [LangName] [nvarchar](100),
    [IsEnable] [bit],
    [ReturnToNodes] [nvarchar](2000),
    [ActionLinkId] [nvarchar](100),
    [DisplayOrder] [int],
    [EnterpriseId] [nvarchar](100),
    [VariableValue] [nvarchar](max),
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.WfdWorkflowNodeAction] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[WfdWorkflowNodeCopyConfig] (
    [Id] [nvarchar](50) NOT NULL,
    [ActionId] [nvarchar](50),
    [CopyLinkId] [nvarchar](100),
    [ProcessorLinkId] [nvarchar](100),
    [EnterpriseId] [nvarchar](100),
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.WfdWorkflowNodeCopyConfig] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[WfdWorkflowNodeInformConfig] (
    [Id] [nvarchar](50) NOT NULL,
    [ActionId] [nvarchar](50),
    [SendWay] [int] NOT NULL,
    [InformLinkId] [nvarchar](100),
    [ProcessorLinkId] [nvarchar](100),
    [InformTemplateId] [nvarchar](100),
    [EnterpriseId] [nvarchar](100),
    [CreationTime] [datetime],
    [CreatorUserId] [nvarchar](50),
    CONSTRAINT [PK_dbo.WfdWorkflowNodeInformConfig] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[WfdWorkflowNodePreProcessorConfig] (
    [Id] [nvarchar](50) NOT NULL,
    [ActionId] [nvarchar](50),
    [ProcessorLinkId] [nvarchar](100),
    [VariableName] [nvarchar](100),
    [FixType] [int] NOT NULL,
    [EnterpriseId] [nvarchar](100),
    [PreProcessorLinkId] [nvarchar](50),
    CONSTRAINT [PK_dbo.WfdWorkflowNodePreProcessorConfig] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[WfdWorkflowObject] (
    [Id] [nvarchar](50) NOT NULL,
    [Type] [int],
    [ShapeType] [int] NOT NULL,
    [LangText] [nvarchar](100),
    [X] [real],
    [Y] [real],
    [Width] [real],
    [Height] [real],
    [TextStyle] [nvarchar](4000),
    [ImageSrc] [nvarchar](1000),
    [EnterpriseId] [nvarchar](100),
    [WfdWorkflowId] [nvarchar](100),
    CONSTRAINT [PK_dbo.WfdWorkflowObject] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[WfdWorkflowProcessor] (
    [Id] [nvarchar](50) NOT NULL,
    [ProcessorLinkId] [nvarchar](100),
    [Type] [int] NOT NULL,
    [DataType] [int],
    [DataValue] [nvarchar](max),
    [BaseType] [int],
    [BaseValue] [nvarchar](max),
    [DisplayOrder] [int],
    [IsActiveConditionEnable] [bit] NOT NULL,
    [ActiveCondition] [nvarchar](1000),
    [EnterpriseId] [nvarchar](100),
    CONSTRAINT [PK_dbo.WfdWorkflowProcessor] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[WfdWorkflowRight] (
    [Id] [nvarchar](50) NOT NULL,
    [ValueType] [nvarchar](100),
    [Value] [nvarchar](1000),
    [ValueDisplay] [nvarchar](1000),
    [Allow] [nvarchar](max),
    [Forbid] [nvarchar](max),
    [WfdWorkflowId] [nvarchar](100),
    [EnterpriseId] [nvarchar](100),
    [CreationTime] [datetime] NOT NULL,
    [CreatorUserId] [int],
    CONSTRAINT [PK_dbo.WfdWorkflowRight] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[WfdWorkflowVariable] (
    [Id] [nvarchar](50) NOT NULL,
    [Name] [nvarchar](max),
    [Type] [int] NOT NULL,
    [EnterpriseId] [nvarchar](50),
    [WfdWorkflowId] [nvarchar](50),
    CONSTRAINT [PK_dbo.WfdWorkflowVariable] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[__MigrationHistory] (
    [MigrationId] [nvarchar](150) NOT NULL,
    [ContextKey] [nvarchar](300) NOT NULL,
    [Model] [varbinary](max) NOT NULL,
    [ProductVersion] [nvarchar](32) NOT NULL,
    CONSTRAINT [PK_dbo.__MigrationHistory] PRIMARY KEY ([MigrationId], [ContextKey])
)
INSERT [dbo].[__MigrationHistory]([MigrationId], [ContextKey], [Model], [ProductVersion])
VALUES (N'201607100934543_Dfyf_v1', N'Sl.Bpm.DbUpgrade.Migrations.Configuration',  0x1F8B0800000000000400ED7DDD72DC38B2E6FD46EC3B2874B51B31C7B23D3D7D663AEC7342BF6D79244BA152B767E60E2251258E49820D92B2F46C7BB18FB4AFB000C17F8224000228526674448705105FA2C8CC44662291F87FFFE7FF7EF8EFE7C03F788238F650F8F1F0DD9BB78707307490EB85BB8F8769B2FD8FBF1EFEF77FFDCFFFF1E1DC0D9E0F7E2F9EFB337D8E8C0CE38F878F4912FD7274143B8F3000F19BC073308AD13679E3A0E008B8E8E8FDDBB77F3B7AF7EE08128843827570F0E12E0D132F80D91FE4CF53143A304A52E05F2317FA71DE4E7A3619EAC11710C038020EFC78B8F1DF9C44C19BB387DFA21D062E3C3C38F63D40E6B181FEF6F00084214A404266F9CB6F31DC241885BB4D441A807FFF1241F2DC16F831CC67FF4BF5B8E80F79FB9EFE90A36A6001E5A471820249C0777FCEDFCC517BB8D2FB3D2CDF1C7977E7E41D272FF45767EFEFE3E171141DA7AE975CA1DDE1419BDE2FA73EA6CF966F38FB146FEEC1830FE337B5A17F3AA83FF0A7922908EFD0FFFE74709AFA498AE1C710A60906E489DBF4C1F79CBFC3977BF40D861FC3D4F7EB132553257D8D06D2748B510471F27207B7F9F42FDDC383A3E6B8A3F6C072586D4CFEAB124C78FAF0E01A3C5FC170973C7E3CFC0B61E20BEF19BA4543CE1ABF851E91003226C129F9F30B992F7D0B65FFD12049C2765807D9612A1B889F3C07D23F0648BDFFCBCF1A685DC3E411B95648DDC13F5218279F632A00BDB4C83FB5D08A2314C6D00AB1F367E8A454CEEEBDEA359E8104B2BF2579EC2CC5B99260409761F2E7F7D228A7BE07C3E4323A765D0CE378E01DFCFC938657C0C88DB0D1BBF77FD540EA04A3EF540CC32D32CEB2E7CF74EDF2B4F3D087A34A818FA9F59334F642F209336DADA0DB1BE357053FFCC129B96982C7AC9A314978AB639DC88C232B94CEBC38F2C1CB0D76219EF67AAE40B81B99B2963594D23983B183BD31F92526960E82B700130DD81036F39602D1171047D88B2DD03A833EEC5FE404C6426CC77CBA8C19B992D009423E04A1FC1A8A2150FDC5D95864E4172B2F1EA7C84F8370EA12C250D685641E7A4E68B999EB5A594E711ACC654C5D0B0F4F97F881756EC42815D6FBA2E6A2E4CC05570243D4AF6130648CEB71B388B9B30B03B2C85A5840181F9C87CCE69EC65497F195177ED385F5F51162A80B2C63F4136DBFF3578CD2481FDCF16E87E18E2CB87A00B3377719466952D75CC66CE68ADC2922C239C2B6D6CD80D347B242C14F1E3105F08B1E9BA001B91A08C3EC7143FE60D6A51D97D3CCAFA848DFF8C60DFB57687010251745BE371DC8B2E3F90A5CA3CA6252D07ED5E055CF4D7684F4ACB7A7C8B510721B0DA7EBFA3161029C219341131DE8FBB78F2834FFE6CE03E0F9C6A98C38222A761657693B89F7D435482DC5A594BDD4996AEDDE1DD07169D3E4593A0E21632384BA056435A02A3105BB6199B3B4F6557399B0061620EB5A389F707DF14D4696456B46D6062649467C029FE5182B9B0D7FFA514FD008D5DF819F0E91FD49749F6DC642F575EB7E45F8DBD647DFE7E1BAD0E57892485180559EE6C361FBF68A27D803AB1520C64E644A4334DFBDD7C04663CA580F95D2C6601FF41509A68CC828EAE055F30AED50A589A49BBD1827F732DEA4E4EF6337F0C2A921815F61580B0608BEA9F320F2D10B845FD2E0A11A6C2C7A0F7D188D849AB41022DE3C4ACDEF12DF8238FE8EF0109BE84978B59932371296D093B4462381E3A11D3DFB1402F14D4DC2DC131394D578A147CFB3083097AE69FB44E7B92FD9EC8186E0A4AD58DA39C6085FA19D9729FA929154B352E3A40928BB72644C768AC2AD87836CF9D11F77E99124DB442FE3FA6FD5B1055AFF19D3F1BE78CE371BEAF2C4C3C9A30B5E6439E50A3960242559CF5E08656A62577A5BCF5136885E7BD2AFB09D4F8CF413107B0EF9F140D6D8AF8F5D2DFE79183BA30EB29EFD1E910308BA3625CFBC98BEE8C90A949D6478658717140FB0C8E887F3300D1454031DB66A85E95A61417133C629868928670908CAA58A9122234E5932B1823C65E356819A2C50EF351E8BCBBE89766EE20B5646CB4A86F731F19CF79DD1F44ECFE945F594221B6E6EF155AFE0131CCA217B6FD12CD1F3752FE33B848623DC323A931E8AC7C13D0CC8C74CA4F7F03A00AB16359D903E7E344453890A8BB6F64C3760E4E488BCAE2D7058944B3A69A98BB04AD278C2A78D30918DD002F99386C0A72B870BCF87178886768D6FFD20144D9F2FAD8353177A3D79AD1C6649004E54B44B26944FC0DF400785EE44CD0D7CFF0438DF5801A557A5C02D9F25A26CCE0E109ACFF426AACF16A9CB58E5D8AAD22A750DA288FC88E98B5503685DB304B449B5C49B1794FCEB68A8C24377222E3C68FEC8E6657C8BBD00E0970635E5832F64DAD397298B82C9CC9AE97259C759C5D2B45366C348B494FF329F5CA8C56D19DD229CC8F0918C82F88C1E14D40119B50AFFFEC391B6B6A869D8937CF2B1A0A7DE757A7A36CF1504BC5454D984D6D11D034D8A8B6E4F90B7BCD72D68A518F1F272E5990A534997AF46AE0A70F8338FB1B29E6D8BD1F8ACAEEDBC59EC44AB9E89AA0D5DD9763D1365ED4C1461E025676FC9882611A754BE2A76397015CB7998BAE2D59AF5244BEE2B88A4D12A3C83110CDD9B9031F2A53B1C4AD0B6EDF25B949D93301E3D3778D27EBF6185CBD085CFB764815837E285F5FB05784229F694325A5A08ABC69F68D9EBD9C9C895D66B12EC57236D5439DD79BBC74459DA4A8455DAC6C24F36D6812FE4490BDBF83ED899A671436C1E628624E9C4F39E4D0C3D99A4F282364DC8560113F8D0B6169AE90EC55874428F599DB39C995DAD3B18657B66D20CCD06AEBCBC3C677C16A2A3EC43B3DD1FC67DAB313A3363F40E2905F6E8B055934CD624C6EF8D9BD1211C5B079E4792133455F47E1D92AF9621938F5CE57FC40A442336B11E56B4B3176D5555082A34196EFFDD83DF95EE76AD8F5D397EC4E1D778458EA125EF959AF734677BF3C750029B1ECF962DE2A540ACE6FCCC16F5F2CBA8DD42DA455855DE3CF4893DD55A8F14184B985F2F9914BF2851D356BFC44589BA8EE6ADB7685A4F58D176FDD1AB58E38597CECB304E8E779954C8AD98E5C075A19C4532F3D7AD7B4AA47087F07076A6366A42F953DAF2C1B3808D843AB8F0709C587AF5192D3BD108565AC0D2EF62C42CFD309AFD57F91C723EC879E8AA0FD5B16ACD3C02BD74FF2E5B6B9204388F81EA4A558E5E97AB112F08C4DF5E4DCE90E743EAB7D8A1B4C66944E4F80C83AD9208670357E91D095362E498E7C39BEFA1ADC2EB19292B0768EF51E43983397BFB16611D15F76FB1873091CA692931B46C182B556F389442F5AA15429C34A1199D201175EE5E5354827E7A9575828E5B978911F36B389CAE49D5B170EB4890570FADF367428A7E622BBFEC16248FC689E8BBCF1D8A5D94A247914EB9D2E535D8B7AAA7F9EB6357F535FCAD478EF3EB90BE1FE634FF1C96FA6BE0F92AF242C7ADB23262416314D871D5EE912D3A8C5F06A8E82987E9F9A7430EA1A6BB11289D797B1F948568C0CE4A4EF73DB2466AE4EE0B3DF6D0267DF8377486920EF4988B27C81D5A14F5FC987A10DEF0EFA121063BD12C3B54ECC4D5A758D01B18BAAAE3B8A76617617BD0AFAF627BD071ABED317210006E2BAA7D91C6DA4BDF10070EFE0A4388E955C1C4CB261C12D299C3ECCBCD43C4E8F23465BDB6B3F575079D27B5F8307254C7B1D28BE695B595ED004A28DB7CB046C8CACF5250D45F5032648BE9B12CE8DE467E3B94D2CD1B74E40954BC5D9B0D2FAEEF18B96344CFB6D613F983D0A1F7A2A3B03B71E87801203ECE2D26FFCAD694C3777F3D3CD838806ACEF1EC27F27358FCDC7890F22B51DDE14E8AA128C7532D48F5857CE60C7B65E62585D1B195E6DEB32F37B2AA008FBEFC33F02227D194FBA86C1CA709A2B7EAA495800B8D975EFE6664EBD17C10557B8F8E5D6DBE391861CC67A381093B94EE870205A6D97603B1079402A46CE4CAB2360EFE4867EAC0ADF76C7FE7370D1ECCA4AA1A978247809576D5B281AB0C8CF805F425598ADF5B5921B21FA4E20CDC41100F9E5BD617DF1C31D15F53360FFDE82AC24BC7ADB23BAB309BD56434AB1B5D59F41C9E184F2E28E85889F814C42C5D79731C4544F4808D824725292BEFB1A466E9454ED9CAB9F0422F7E844ADB394A910885B022ABA861C718B0B2D37B8AC2103AC97DFD4099B1EC848D371894552830CBA1316405FD6423E7FE672DEFEA0ED21DF841B5FE9F3AB2B91847DBD94EB6591E8699AAD077E3CFC396F1BB9FCD1B919FF2FBDFD44C49367A3528E7E0A1D1D07AB9A8DA88B197C4CE83C8472F10368321567EE7198C004E6C54802949D23C7CE024767E6C9BEA79309CABA727936B353A35F2EA65E8251ECDA5B721932531FB325992B627932549AB32D9A66A47264BAA362E3DCA495991C9929A11999436884E51F4A26A0ED1B1AB313439AD5D531919914C7D4D49D663069EA6CAD763AED0FECB9B8C46FB7FD294274308754FF28DFB5DCBAE702CADCCAE0156DE26A063576536724AE0E575699845883E65CCE9C778E722A6BF03ECA9D413AF8F5DC5740E0198E26BD8F0F30A5A26EEA11266DFDACEA52CF7D686AECC3BB60F62E11E12EAC08FE46DE923342220C6EF7E3071E457CF9ED75AA55E5CFB1C47D1AD4261887CD8AA7526CBA9E5FB2DDEEB391F9ED7A2367F013BCD46B3F10639A707A4AFDD7C2073FD9404E6EFFD60A468E01423DF1F8CD5EA2178EB58F95DB78EC5DF64FA9E363D89FE6CF7DECA95C9B4B653ECED4288CB34BCA9EEE194BA4BA215A2B4FD762D75AD966E0FD4521B15BC9162E86A178C1BC3164BD55B737EACF8249B90C6A081F17D51E5056224B14F8F616435E1F95FA83AD37686D22CD036323DCFADCA110ABDB54F90734FF77C56E275295BF052A672BEB6357C5DD24693AD7162A78CC879E8DA2144D8973824AE57F7A905B749CB71A3351BB52DBEB6961D7B475F88DC35AADA98CA29BF2E0910F8F1B56D06A7D75ACAE91679F25790F030562D27CCFEA37778ECF93AF97FC831F53FE51EB77BD7D6BC24EE4BE64E290B1B1DBECA99743876928BABE778B4808BAB8750BEBD62C1AB31E4E36A2A437B191339C47DD7828EEA0CFCD231DFCC6D89E4A599ECAC0A348911C6B1B498E4E3101699A78E897E4E8388D238F14280870EBBE9111C4A6ED437D0F4D3689EB2A5CFCD6AC1D922161785E0185925E92B203A55E48C4DBB9AB450C53CDD44F7F28198CE99F4811884D597959394D75D505C7D690AA59D3F838038A16A0B101BBB4940E802EC5A79C5B478DE29F0E56BB71703C7C2159A74E7267D10751F6C462DF47C04C39E573DB25E0C9134AF9BB1764590CD2388784587656F6B0F88A5BBC1162E359843B272CB0F64AA70A233C940569752DCA55CFE2628F58C14D6A43B48582064D7590C256F2DD127329DD0A367962673CE5FF51E1E6559EA7211977EEBED26AACC0A68559B22226C2191DA9E372D150499B7DDF1EA259E39D65A64BE0EB54AFD3CA49E5ED3F3154CBCF8D96AF0C5B6F2C8EF9F8001B16D121B0A64D556EADAAA1EA2D2A2B3BA80ABE69A87E6B2AD0704CFC56AAAFAE13D4F0FEC585524A683C32A1AE126BF64515903308055E235E70A680A5C66A77DE1F3501EFA62E3C92AE1E391AF44DED4267919AC42FB93A6AC81D71051B6BB89A1A2DE4A7D3B41C39518AB929B97B9315D3D12331E48AB663AC84E64F404C4F23766D24176A6A71CCCBE8CA905FC5425AEF7EC132898D54FDD6CF845AA56156577C7563C6545978D5F95DC988F4344CBCA3E9DA534878C4C2ECAE6A91DFBD9A95DC39AE902E107CF7C1197592698DB087AA99CD26B47C1382B858AD253ADAAC6815855DFF0671C09EBE891296B319DB9DFB2342C0C59456A2F84B8B0C51E684BE6E977E4801E1164A210E7849ABF89216E605265F61FA7C486BA42E4475493A03B21FEF64DA3F76814E9248DC934E338BFDD8507D77A4412F314F969100A20170F2AE19F3E8270073F79E4D5D214714162AD51E3942BDEE5D3A8F7CBA0D138509AD5D01A46AD9E934127CDEC2EEB61F0F231196CBA688C01B367C65187DF82CC6FEF9F95D05CC82243DC34CFA1AE2407A6D93D8E751EA6011F86F58C236415D9F91079D738467317900FD67E4604957CE52D7060B157C5876D3D24817B0DA28870A5107CEB59092A1B889F201622D27C749CC667F4C047CC3A84C6F7B073BD731C6740BA1ABDE348C4FE4AB98B45AD4F14E5023CA1147B7D0CD9794814979E7DCB1DEE7EDCDA43A2B8A398C278773042B807AAE81340417D5F82F58821F4F268D9398EF3BB07BFF75911CD6E09AC5EEB81F7D0082E2DD47CBCCB6E43E9C0D5FA44509204388FC10054ED0101BC330CB67D50799F000ABB75970BC2BA0430069444B35B00EB3ABB8D858BC3BA043068CCBA0783750962B0EA2DBD38AC5B00ABB8B29E8B54748AE0B04BBFF930AC4F00855D3ECC05615D8218E56D4C0360C5FD748290ECF6965E34D62D88C52E4FE8C562DD0258552C828B55758F6035CA6D77A01ABDE348B41019DF54BD1511B446B13DDE5CAA5E71A41E69E93C21879857181983CD1F13C766B5148660D9137288C5B19A31DCE23939F47A16FA1885FAB372549A99AF63749A4FCB51E265AD8DD1E38D11A75A64C60C51299E1147AD6D480F01D71E13C7EE331DBB8F88630EA834EE53BC085619AB2AFB3E1C6D9C471880BCE1C31179C4815192023F8BBDC64547EE70C5D5C8BCE560131157E9E3E1E97F6C0E0F9E033F8C3F1E3E2649F4CBD1519C41C76F02CFC12846DBE48D838223E0A2A3F76FDFFEEDE8DDBBA380611C39713D12D68EAC9594128489A66CF5B2721E171E26161471D31F000DC99CBA41E7B12A32D7F3D20B3ADDE05B3B725C7D82620CFD779E30C442D7670FBF453B4C56D2370340D56BBC20BF8C5A91D98F84E59406A7918DDF38C00798139366B6725F5C7B6874B13D504728DAC451A8F7EC39790A621DAAD1218E770D9347E476E1EAEDE26877F08F14C609BB0EB80ED7E890C18B2314C6900758EF11473C7F864E5AEDFCD4215B5DE2986729066C11ABC355ADE248A7BE47B8F5323A765D4CF46313B0D3298BDBFDCAF57671B4138CBE53C625EB5D13AED121F34DA872ECBCC05A7317EBC3514BC4DBCAE4A8A34D5A3B506D0525AABE9AE1FCA93A6C104D4C918D4098D1666C1FAB3E9EB54868B26C1DE328B25ABB38DAB1EF81B80B566B9690E746E24F43A61B3DE288D599E43A5AD52A87D4B866A20DD8E814C76555EE1BACD466909E4724E4BCB173D910F5468FC4976A54046E7CA9468F24625527B80359758963D6CA013704AE6A96D0E48DC485862E6FF4482222EE2F6E75CD560BE7014CADBA988FA9A091FB80CCE8657D9A46AF7E9EBE5E94E9062D43B56A9691486A907AB82B9255FB3ED78B413D3C2B0DCC8A10363D8740CAFA234BF42E64A1FED6CA5D344B695AF6C68B8CDB96BE6D76CAE0D2C81A1FB4DE2383F8F51162C8876C74C960668C76D2F3EB5B9D32B8D926791F6EAB5306F778B7C37007929EF7D0E916C7CE5EE16518A54957F3B4FB5450B3A0479B6739DD335F339B193C0616D04102CAABE908AA99A5F52682CCA3EF7254AB6B5F8B6C35EAC677FB00B3AE75E1CE350CDDB9EB8295CDFB5FB257831FB65307A7AAA97E28318534347EEE563D2BD2DDF8E69CCDBD21046E6C52252649F7109CA43D99BC510207FAFEED230ADB3FAB6A96B08F832CB1A26118079C5C8B218CE91671717EACA395F2D6FD441EF47B39F3526D233B2E5CB66FF7494891433740DB93AC5A6522565B90FAB5D4A266CCAAD5394F955ECE4F9F6AEF839455F1FD386654BD7E17BDF8055DD5DFEC99276B1459F5FA38A3075196317A61CCF04577F9975DFAF303977588BC699FDCD93A62D470A79B5DF3E4CF2C7D5C1F73F2E06439938FB11475259727B13F16D0B6664D5BA96CAF4F7F872FCDE159835D2D54AE5BECC06ACFA25674DA60E6FDB1A116FDA3AE756CEA9ACBF8264DDA9E4CD6F4DA7C8ECB789392BF8FDDC00BDB3FB8DE238EF82B0C3B7E5BD126E31F473E7A81F04B1A3CB4D1DA7D122146E28C465D0FBED62CE557A1B4B3975434CAE443C4F177843B291045EBBE723FBA2EDE906F3718E7E07AB4CD9EFD446134C63F422FF180CFFF989D4EA919FA44B6DD976C4A801360E9F6EF2336708E31C25728BFFFA9FDA9DB9D329C1827CDE16D9EECF64BC81E65982CA39DDE314F5472D773ED794452028669F43C22C325F5697679A4DD2B835C9F5C17B9DD2BE1667ACE378EAB59B64A6C887838797441CB5AAC5A25B80D399CFCDAAA558E6FAF91EB6D3DA7C70AE03FB166A4EDCDC46D140B9864E70E210918BBC3C3E7BEEFA3C3EDEACD3B55CC39CD1272E88E68970DCB76D90C567ED2EABE631AEA7B27FB93BAACB6C65481E38188C91A7FE48F2066ACA84993EDBA654E8610F46FD52D2E3252567699CAC15C143116EE193A771E662A339B3C5F9B965D723C9D0DEBA613B5BA24DC24E261B55CA4ACC5E656BD814DF1C9091AE50BBD824FB09DCDD0EADBE7A27819DF21D489E7B1B639E9915651A7A90A65184E4CB38C61985131D35301B959B303B9B2F698715E71E17D327BB3D4D8746E1FC41365F7111033FCCE2A95B531AA569B9BF7B7AC624257041B1DE278B4A2112D9D025AC2586F9789D020CECA5EB54A48F63374F847B365E56F93009C74A16ACD32716476A1FD063A28EC84919B7D121A02F8FE0970BEB1B3F62D15D1EADBA76E3495DA4C798D41C55D262C3BA4B6A6B970F576A9182BF7504AFF59941968ED6605476DCA7B105652878F6019DA3A6EAE201DB06EB7CCF986EC07717C80668F8457011270E1C1F6198E5AB3D42604F602805F3880ED3EB91976157ED5FACAC5AC51C3549B940DA14A0AD930D45CDD83E96692AEC309F34B23D0BFACDF6625521BF3E2144DCDC6EF4DE268EDD4A9F2C5C1109326EE4033B2333DEAA32FFE476344E4A7F7448FAA1E8535A867F991C3BACA2B6936A1AEB8F5358790B8114E85D8260B8A92F7C28F96E61DFB8C29CA45DA5ED31E4051DF5B830E51CC911C1A6C46977038519A07F514AB5B22C7E849EB1E0012E39935AD5B6B5A3779B31C16CC5B5F3743E7370A4C65673E8C1833F78D9DFB4EA8A9626BD33D2579AFD99EB571062318BA3721FBEA976ECB1BE3744B06757F8BB2DC524E5CB7EC11479C72FECCE25E69E8C2675AD0BC1BB9AA75ACDB5D6ACAB1BA1F458F96ECC5935197032066F4A61E9BAF10EB5624B46C5D37792BAEDD2FD757B7F7E8E1FA5E3C19AE1F0031C3F53CA52AAF4FB3FAFF2D94A24D6243CC07BBD64E58D6228E7043D656B21226696BD1ADB74BADB61DA47E947DF3B34E5E9ECCC75679589FCE9D6E99EA7004F36B1CEA18DC9B1D18D7EC8BEBF24BC6A6321C1F468CD7FAC6AE8E952AFBEA77875814987D297E84B8EA5B8DA312717F628D34444B78208222CD1D3977819ED389836141D4714068FA6EDD2A6C95B0E9D8E3EDC11117398B7BBD945C1BA168B3BBCBA35FC69678D0ADBA59752A17F62289F1E1C070339CA8B7FAF08F786D0ACD78DBFCD14A93281B65D7A69201F88B54A37B35154BC4FD6B0E365F7DFA838F27A945FA40E66E4BCEEDE2911FF3828AF95EA0D0FF0ED62B354C5EA961222F4D5F79EADEB5D3FAAAB9A7F5885EC17DBCA332336919EA8511587D06C6CE79CBB276E3382705A0DEB5DFB402F2CBA89BDAFEB5599BCCA92B1C27BC17D7E890C4E378A3F57689C53F3B45C79B5EB347169133C14687640A0A31F161CFD9C2AA4B46D9B87CC446870C5E57F7CB2B7C8EA69F41186F753E0A659F24C0790CF468FC5E2C51B53F006046F7DF83F85B1BA168B3BE71EFF9909AD95D1D58B5CBA1F1905639519293330CB61A44840B23281D3D63CD0806F9D3E90490F23609E5FF3DE4171D6C7448E27156E17ABB84F0A3C8735AB2CF9AF62920E6CB4BDE620F61C259EDAF5BB44A28198483AC946153CD94AD72EA8A8354B6DA8CD59830BB4DB8078BF42EE9279DAE477928826A943FD48C16EDC61F65238F7908ABCBD48D0E099E7926A362A234BA536B75C9EC3BB4AF65642DFB89E1982875ABBF20EF6A58E5FA40CF51B9212441BDB01E96D37A586E792BD335BDA3713217F2500439903FD40CF75D601470E377B576194B9A8755B5CA205D776ECF2CDA24729969E5FA96695FB4C9A17417DEAA75BF1625FD5234C8D05DC89B3D32EF9E8F576F97787B93EBA26ED2877FC3F6E5AE65A338CE0972DB1708642D12BBB75560AAB97D5B6B97F39A78FE75BDDDB6A7AE2710A6DFAAD9C0D0E5C4C8CB563924EE59945AFB2B5FE1285B4C5FE17828822B1C7FA89915EE0E6E3B0992AC691FE1E1EE3A52B52AAD23BC9833A75BE67D394F5D49AB5AE5345217A96A9543CAAA9E749058AB1C12AFBA4ED52C8795451CBB5879B30256CFE4D4229B7267EEFAF936E9F06C221DCBCCCB4C73A398F53E89684136EA04726F8DEA74CAE216A558FBA09BFD12B1EB27F20719436FF34261CFEC7B1F92B32EB21857C7B660AD52B95020BB9DB89D0695B7CA7139D548546A391BC29C6E09DB2C7B556DD9A95A6591F83988EDBE7D44DBBF028FBEF833F0D212ED46871C47D2C480E33441B43872DA1677EE033623F18BB5B2E87EAD1E4B8B8724616DF187CF79339DF92ED487E5F934AC5D16ED1EF1B0EEB9DEE81E396703B10734C4A0F838825CD337D810CF4CD611B7186EBDE7F6F7656D12B60EE7325AF94B6817A9AF368F006B08BF736144798E3FD60CCB65C4B8C981F50EDB6A2F23CE897454CD32AE1C88DBE7938AB67D18928B140BFA09A74B050F455028F843E71B2C594A0674168A84272D83BC6A9547E2F8EEAD2E794C6E61E14EA784731345BEE780EED9F54687021EE7C7B7FB1450B93FBFDBBBCFD0F485177AF123E484A79B3DFB7015F50480D88951DEFAD6ECB1B929748AC2103AC97D3737BDD923F1AEBCB6DFCB5A24105A6BED46AEDE8C8634C43B4837C5DA3AAD6A95FDE6DC4DA546CF3EB3F7990D027D37FEDCB173DA7DB3B3294A25A6C7B8F8C44AD6AB9B187D00738E11D0385CF91EBBC13A4EB7C212741E443E7A8190E71AF63EA4F81BCE600470D2DD60EE7D48E1F7D08C41E024833FA7F58C3A95F3A093C6D1F3C86AC2C870CC65E8251E4DE6E3737DAB5B66EF231F38C4F5BD0F29FE8621AEE73EA4F07B06B8BEEF19752A1CAEEF7944814647F1D63B14F0385CDFEE5340E5727DB77776CBF2298A5EF4ACC83C2489F5983FDCD06AAC2D6F4F733EA1C69D84A99951FA1D473DE1B9CB988CE924CCB33639539A9787F6039C44A10C750DB0A6201F0F4942EAF9C3CD48FDC90B4F52ABD6E5670DEA9230FA55BA87528AD6572E1FBF03EC4DAF68378424281FFDC3E7ECA316B3EE1AEACD1E7944EEC98F46D76CF8A816F89FC6460340025C3438DA0C13E9B98C91731F7AD92A87C4F7176559507FF926BD86A3FE58E37A508F8931350AA789F07114DDAA1DCFEB1D694674E75F31342F4516B7D7A807E9BBB0E8567EF7B756AD363379AED103A1FB29095A21947ABB2C1A8DBA60E4FB9D5BD53BBD127EA5D39D63D12683D237B766CF3E95B37E759A6F2271EFCBA9F7C858E94488BC5D08F1AF90FC0F704F91771E9078ABDACF7E9B38A1AEF304FDBAE4C1467AC964CBB50F48CC72ED1F6D66F9A396575FD24DBBCFB63DAC6759DE84D49A01ED93A565EB3E55EEF40C09137958FF42ED746CD622312BCF6D5709C99BC4313EC1EE9D4E45DB3E17B57589F8D19788E9E73D46C0E4960A9BA73EB27AA5BCD3A88D0E19F1747968B566712CC232C49476BDAEF3D5EC914A3F63833841B8769FDCD2D655FC55EB7E1366093771CE2F57AD128B5B6B657BD531F4963CDE226F6ACE9708A2BCA2E88131A32D5AB4077854BEE4A97E63EC1F4D987FC88CFD6773EC3FF72DC54B961FAAF9B5890E0F4C4E6AF8088636A32687D5E6E479E5915C4E569C7CE0678EBED7654C3806F75CC8D1E892125CFCD263C6B4FB24BE043BD0CED1C1CD1EB9741B18C75D866D7448E321CC9B64A7531CF7731A44742E275E08702B63BEDD2787CAB35BEBED32321BBDF07E76BD5D26398F16AEE0E1357B64F8BCA854C1107A6EB6E13E234EA5183F522C43A94C4635B7BE721FFC275428F4BD7DFE132A5F81C9ECF057683E23FF3BD8F8B19A25D3CAA2749507AF5F4687C01135D2ED97D2F6CF20207E508FBE6F764A687C369038D0A10B30E78019F70109DD9F26E814F89CE286CD1E79448E57DCEA92082CA40F7D4670AB6BBF86F5DE9C84D94454378F20E244086ACD123215104370835B07E2AAD61FC7E1611A4FABDBC38794777EFA70E6EA02E97360A815CFB7ED6595FC1D4C521CB2DAAAAD448E56D73E8DFA25E4144CC98B5C37380E841512753E88AFB9F5765A95523FACBC621AC232A39CF4959FD3EBF399F29ED70C4B1BA2C63C4203C236042C2F6EC3687317385AF9F92B684580CAC67D86574C096F5E6F150664E54E3A02DCED5DD54289380BB5500F5718500EE3F0F22A420473EE8AC29438EA3F2274E13D77BDA5B271AF89BF5A2271FB17C31B76FD842EB1E3C3C989591FC65CBD719DE1A2EC38147CE6149060AD6B184FE2CB9237B6495EDAC18D5AF3B2C2782682C0FB5740A596D4A6837A11E5D4D0008C194D646A599EAEE1E89DA55D94AA550E8913D7AA358B639D8098A376AB563924CEAC6ACDFB8C305EC6D4C87BAA123CF921DB9E87E40CCCA7BE04D34EE78FB17171972D3ABA3413174D4E2BF54098D14819F37745ACD62C89C5C191C6C8C5880355F648F0BC4F4F2235399D35493829083F78ED834579DB527324D728C681907ED053544400504E4BD82E31D2F5F8653DFD7D5EAEB238C3BAE8CC6AF07921C4ED474AEA794BF9775C3450E621CECB3572A11F57E336CE230C40F6FBE308389025D75E78384EA88DF6402C22F6C8E10179594F1E3165083FBFC40924FC4C1E78B3F9C33FF53D48AB1B160F5C83D0DBC238B947DF60F8F1F0FDDB77EF0F0F8E7D0FC4343CED6F0F0F9E033F8C7F71D2384101084394649AE4E3E1639244BF1C1DC519C5F84DE03918C5689BBC715070045C7444B0FE7CF4EEDD117483A3F6F01C5608E5EDDF0A9438761B9785D404B9CAF93D4E891574855AA1BF0F7F872FEDAF5C70D41DDC1EF409D687A3F6C00F1CE1A433F878183E01EC3C02623F5E83E72B18EE92C78F877F797B78F025F57D2AF11F0FB7C08F3B82D3462C74AA306A82BB4B751B7403F193E7E441BE01E4F77FF95916FA1A268FC835817C07FF480973B2EACA4DE8FF1580E7FF2D8F1747288CA13640765355B9B23244172430C9FE96FCF06729CEA58301D1B332B2184CC02FA363D7C5C4271DFC223FFF24FB7B19FAE8A77EF7FEAFB2C827187DA77C1F6E916E2E3A7F7660547FAF129FBCBE148C699E933426FA3E8EEFBBABFB92D40F5BDBD53990AD41E33CF2565A8765EB9209E0A6F7AFFED3AB2C2FADBABB53BD67483EDECAFF7C560EA5C1BEDAD79FA69DA715BA79F0BD5F070B635527DEB5CEB376FA9DE13E780AFABDE1CA4DFBB12D1F6EC28F555693CC6E5FAEB23424F1823A740FDABDA43E0584D60EFE23F5F0345110D0DA4296C7B0DEEB180942731B52776A88EC78A0069B95ACA2BB90D5B8D7ADDED80729A2DBEA5FF632A63B293A70BE3E420C7500655C76A2E5B76585E9F5401DEF7618EE88FA9F0E96BDA9CB304A93BA8AD0656155E8342E32CE7C66D79BD347A2B6E1272F4E3A555A97B4F8DC4490398C964C76852956C837BE6E7BEA152D654492E9652DD340CC1AF0CB373CAB3579B9222F646F2AE86756A641B3BB2E1082529A6A76B98D7658E8FBB78F28D4FE1AF25B78F482F2AC41B92594AB84B244821E1D64CDC5D564D7CF5361F546E67BA445CDC477683E928140CB16A47E4275504A6B640FF3B409C55D925EAC023718072B5ECEA82E37B3A86E609278E182F7DD04EC5F79D03C8F6600F5A7B70AB006D9A8B57D6E9D8FA8925D2E1319FC3096CDE5E5EB5A42711892263BC87D83717156002D1537595C53ACDD07D7C69232DCB36C29BE8C6FD264821DBC14DBF332DEA4E4EF6337F0C22926FBAF30AC19EB0A2FAC7DCBABDE4011F149A251D74E1E9798D928D51E47BF0571FC1DE1E14FAD90616170737AD41B50D82FA65EB3480441219225E4E9AB08D3A0FF2CA678B2DB6B7D211E509AA14FB489FB924D144CF4D30D7999E718237C85F23A7BE5C757CBC7889326DC54659CF14D76B6985EDF4034FC6467AB87F50DD3B88CEBBF646AF0BA3EE369585F3CE79B012575E2E1E4D1052F533FFF1572C0680A8E42388F32EA3572BDADE768B31B5E715A8CB0217A12052720F61C9AFEBC5C6BD4D0CA2DE0CB288408C5D2D494C2D3675E4C1F9FA46058AEDBA2D2DB9492136544E43C4C83D72E1D3371F5B357AD1953D37E89300B8FAE6F32BC9725C3BC72E67BAF9A929BBD9CA95F83CF8419B4894C9F63E26058DFED7CA790F5AC6B9BD18003507C9F2BF80487B78EDF9B5BA914BED3657C879078DC4C464F340B862D57614C4D5AEA499F533BBD64CE68996700548EE1C8CBD90207F22A892D89E3687E8101B7CD8043725BBFBC435D44E88DD2C5F59A7A439D08455327474F0CD68542297982F391E905783A84ADB88162031D14BA933415F0FD13E07C63C743E7AEB0CC264F5E7845EAB19E041FA24574C25535C54D44604A4D9A9F735FBA426DAD0CDA99257F4D934F23D2A0D78507B5E75D5FC6B7D80B007E69802B65FA9555AAD47FA525DE65ABE8D25977EACB36B0E89BD9E3DBE3D6ECAC8287B70827E21F5C46323EA387E5CA8101A7DD50909EC602C8AB1E8F044CD0E3D336FFAE20E8CFFD10CB1E110873A9082B0DA19177B78F88FCE468C94C33BB98E02F3BB96B9C2514425F02D109A548ED3E62F26BE6270772A1999FE4E3CE77B3538629AF919B2EB9ACCE0C6AC3286CBADBF7CE8C2DB7673082A17B133246BA74C75C0EB518DC6F519670A6252CA3EF2486559FE33274E17371C7F6BAABC0D16217E009A5D85BF23E969154B0423497C3EBAF8523A9B872CA572F89238D689CE23A75BDBB013ED86986BC216B1B597F927452BE74134129E1409EF516CE768674D654C38BEBAEA8154D6577BB988821DEC188C62717FBED6761D3DBE62C4DE6380BCF310E58577C9B2BFE1D7AF57EB4991AB0FB4EAF3394BB6EA2F6CFEB909245EF71D11FA09F078D04CF4D0A8D925CCB30CAEF1EFCBEF092DF4AF5FF2C2AD545DA5934B965F34767D356C906679ABFE4B4D55EB2B91294AF7D2D566D577BD43D155D79413F4EF1E3E182BE6A1B1263557C15B34FD72ACDA260DA524F34D4695CC07224ACE62FC33839DE518E5EAC76379381F275EB9E12CEDD213C9647A0062EB8C1A9969143FD377521C96E5633F356336823AE143BB76166D60CDBCCB4E9DE39B198A10E33F13C74F5414DD5D8730E282DDC36CF94769200E73158B4E6BE07F1B785EC5C7A3E2C2E39D70EBCBA9E5DF63EC360BB60CE267F3ADA3FEBCDF7D05029A20CD944C6F83D8A3C67645F7DAFEC6DA200D52DF610262C3D65B3919EE3CD8A37E518097C56B0E37C38156360D374DF997CE216FA521C31FAC196ABF34603612AA2CEC22DA3013105E8F367821C13913731EF5B50DDAEA30B53CF1D134305ED94A2583ACBEDBD02C3E507384322CDB90B3D42B28715E09A5E99B358CEB9C02830629FDE2343B0D7635714291C87A098A7C346AF4AD92E0A3B636B8C7E7BEA7A9B4851BA47A690B55D2EBA491FFE0D472EE75258F34F90DB51C66A372355E122CD53A49E8A1177D708A89190934EB36503435717CE6062FC7CDD20FAE197BB0892F954A0D93BDF103314FE0A437A692974896B405E6A4849C3ECD7CF276CAA6F79311284BD83CE939EF80C7274E1641501F4EB3D13B1388A9B05FA4CE19A98F46415F605251DAB416905A591C2BC18A796727314E9046ABA9E81C11535EC46EBEC2944889FC81F04965EA081C2EEBCA1E3058098D2B798FC8B46558839F657A2FA1C4029483B77D4A8C8A261DA63285F4176599F3A435176A7EA8D4AFED43D4EF636B50B0D833594F53612DD165A2880473FC219789922D99425E976F7719A205A5D32AD045D016DE2DAB73F4B896E4B2ED75A3262CB30CF817AA44680EFC76E20D6F88537107B60C121A1D1C8BDD2E62ADC7ACFDAB72F1A37B02D46056C08FA8283CDD9F4CD04F74C68966CBA3A0CB63B08E29193178AB19851B36929BBA1F4032E97B1CD87014CEE7F9B8C1467D13278A27B93A98035E18516D8660A361E4791EF39C0C009D712D9C44B29C1CDBC159D41D50B2FF4E247A825B0AAC1FF991CD460C7E28CAC70DA76444E51184227B9AFE711EBDA62DB78DDA08E54B5160EE4F062FC9381D4B79FE57FF81DA4BB4C23BAF33FA5C32D8C9F8C6CB8183C61C9AC1DE8BBF1E7315BEADDCF9A0D934FACF8EF62CD1323BA83469CCA55C140E8A9C4367A6B76E3579CC108E0C4C0C1C992024D71034E62E4A7B48964F7D5EADE435FCD973E2E62975A13B3DF802C94D8C665A1A4644C164A0A2665A14DC4882C94440C1417CD914DC84209AE4316A4D7D25314BD2C782515C94D53392A29964CA7924E35BEF6AB14691AB71EF77C524F20E6F693D2DD8FC416ECC9C9163563E75C5A485A9EAF015E70E0EEE4654952B704F9A0FC30EDD4C29E98F97780BD2C7CB1586636E2E615AFC580555B40AB567115FEBCB5E0F972BFAE890286D4E21FDDB455C41D65183365EE269E5D98DB8D9D0B3F2445FCEEDB459F8F9A4151BEF70AE747F28A45DA6FFFA0FBCD065EC7403E966079F20732B14F49A0A7102183A3A1038C7CBF1B9C50AB6EE8689BDFADA3796EB6CB022B2463B14D0B13B71FD0A3B6B1B70B212EF7EBA798AF3A8FC80E1EE0D5F0B3279F305EF8F254CB7C58EE12458D197305C64C999D26CCC34D48C32B4077C45A9376E46DB64F5D8F4DA605FD0B5529B584B7807CE6B7E7568511145ED827387029C79ED7A355CB2F52CB2F3B7F3EAB1F68E4B4DD79E81AC1259F9998AAAE57777214A2E62586407109B5E5C890723696574918B97182535362D4758147A4D49F7FE6704BB26F91B7E40A89AD5FA3DF96D364C8FC630A93FC73CA60A3A574F7CABE54FB2E977307E2375A7C0C85D311423E86026E1ED1D46F505A723254AAD1D0FB8D133C5C255E50C2F04BC71ED016F4CC4FC21A519D34E101C6F14446CF5110169BA4F42C3FA74144214FBC10E0E1BC6105D6A7E80256A2CAC4695690990FC70ECB1BC28E8B93F28CCA640129E03A47EE75CDB89AAF60F18049346CBC7926F4DADE3C8333F95A720A53150994D1252A7183F36710102763BAD26738C4770D5D805D13AF9616053805FED48A6905CCB893A9A2E236E983B8ED6AD0D75478BF7B34F8EB21C436809069DA0C222A416C1E4134542E49EC829C80588D1BACBF54E01ED2A55A7E0BD368AFC37B99FB160735C5272AE43B98A438646516C7AE419F9711BE80DB6BA7E6B4BDE6E03B65386AE8130F70EBED96AB2F0C157232E70349BA9D7392A7D7C5FDCC255AF99F0B4B8B987E05932ED230E9721A16A2BCDA200CC80A971810A455484585B4EE5BAFA2BA0F59103E73A07429E1F35457CEA428690EECA8C8C00D2B6EBE589E9F1805D2E2ED67072BB21B987E88488C7C36970A027DA19BE465A4C2CC4F2A1B5CF30FCE180DF9A9A889524D2D5753185EC6A62A117A9DDB44654621F485224E403CB56C3C85D037216D1785533BE9A94A559B7E216E0B70C68A4545F6EF3255BE58B9CF18D044D4D7CCCE51869AB3BA76F0639F1E7ED0218C17083F787A0E54CE23CFCBA0272C9E76DD768547D59B8A3C2FFFEC3BCF5554623D6BCEE13EEBB40EF3485633C90B21AEA5E75D7838A657D78307B280B7D8848DDAC0A44A913B4EC9BA778576870715211AE1F3B76F1ABD1BE7110680C8C803CD5A63D36D3C70344AEA248DC95CE338AF3DC9A3D77AA48768EB2949CAA7C84F8350807EF1A0C82C8A6795E672FA489C50F8C98B135AF7407462AD51E2B36C0D1C9F722529FCC9D5FB7BA6517F448660796FE708E1EAB9D109548FCA4C8434B31B4A86E7513E363A8DF2499959B07B8D86A7C09E19A5CF1E1B273EFC0546DFBBCCDBEEFF7583BF49E8979C4401F1683C87DDBCDDA1D1ECE6116A3E314EED3C4C033E21D6D34383758EC36725E1F8F879570F81BC779C42739F834FAAFD4C0FCDF66322C4099F6E8103F3B87E0FF5D643BDE45BCF49D0BF065144C454681AAD67C766D37A5C62521B889F20169A53F3D1B129359F1E9FD167F4C0A79F75F450CBFA84B07B1442BDB39F86A85A1850708DDE1E4AC20A8E3C7B8DDC946BFAD4FA7AC814DDA2442EC0134AB1D727B89D8706C9D69E13A54F8F5EB0E0C300FDDA4383F46BCF89D21FA52D425798E61D8C10EE2157F4F5502ABA0588A03EDE613D7D049018DFD0E77AE5B9EC1C202228D7BF7BF07B9F0BD0ECEEA1557B42825AAFD9CF7B688CB2A0B94FABD51DEFB2CABC1DB2B53E1EB55AB70891DA3DC27C4AB5077AC9D59E11A07986C1B68F5CDED74729EF1620C2AECDE1D2605D7D2458AF008501F5DFECEEA324BC009437C9F329B1AE3E2AAC578002DD2AE9A1C0BAFA28B05E410AD9F1FC7E2AAC7B88127B42805A7ED51A9F56D1D947A9E817A1F3486FECEA21C3FA7AA9B06E0122D9E5497C1AACAB8F04EB15A490DF82D04FA77860885AF18C20CDAC5A743F45D63D448F3D21482DAB65DB4F8D750F51634F08502B03AE7C6A55771FB5EA89116AF5DA975D628D5E1EADC603E3BEF66DAF4B7F3BE4CEDF8A28BA7AB126EE2FA97A7B7E49F58038A91E95D4796284A49062E2963318A59D3F263081FC49F15964A7D20727C09E18A1CD1E92239B1F2A19255E3C273085E251B989D432D64727537F566042F5C7E526D548241E9D56F36981893507C84D8D933E393A41DE188169F286894F36CF731B9C5CF1CCC8648AC7C48957D93383F46B8F8D4CA1F6A4F82CFADCD9EE2323D4C55C5ADE8EE320F1E17590FB206F9BABDCD02AFB3E1C31C0BC81FC99204C1621E2A0433FCE5A3F1CDDA521DDB7657F1535228B11F98D6744A154A0C533547C8ABD3BF2EBEB332A1E696DED5DC304B82001C738F1B6C049F2AF9945F2B3EDFF8F87E7C103742FC39B3489D2E4388E61F0E037D6E40F47C3F43F1C75E6FCE1262B3F1BEBF809649A1EDDEABE094F52CF77CB795F74774DFB20E846635E8393CC6A93D05A9CBB9712E90B0A0581F2D777062318D21B378B18717C136EC0135499DB6F31BC823BE0BC90F6272FB361FB40C63F44F3B57F38F3C00E8320CE31AAF1E44FC2C36EF0FC5FFF1F2C9EAE3FC3490300 , N'6.1.2-31219')