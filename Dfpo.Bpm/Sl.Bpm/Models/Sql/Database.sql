--DROP DATABASE [Yooya.bpm_dev]
CREATE DATABASE [Yooya.bpm_dev]
GO
USE [Yooya.bpm_dev]
GO




CREATE TABLE [AppEnterpriseUser]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL,
    [UserId] [NVARCHAR](100)  NOT NULL
)

CREATE TABLE [AppLanguage]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [Key] [NVARCHAR](512)  NOT NULL,
    [Value] [NVARCHAR](512)  NOT NULL,
    [LanguageCulture] [NVARCHAR](100)  NOT NULL,
    [CreationTime] [DATETIME]  null,
    [LastModificationTime] [DATETIME]  null,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL
)

CREATE TABLE [AppSetting]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [Name] [NVARCHAR](500)  NOT NULL,
    [Value] [NVARCHAR](4000)  NOT NULL,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL,
    [WfdWorkflowId] [NVARCHAR](100)  NOT NULL
)

CREATE TABLE [AppAuditLogs]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [UserId] [NVARCHAR](MAX)  NOT NULL,
    [ServiceName] [NVARCHAR](MAX)  NOT NULL,
    [MethodName] [NVARCHAR](MAX)  NOT NULL,
    [RequestJson] [NVARCHAR](MAX)  NOT NULL,
    [ResponseJson] [NVARCHAR](MAX)  NOT NULL,
    [ExecutionTime] [DATETIME]  NOT NULL,
    [Duration] [INT]  NOT NULL,
    [ClientIpAddress] [NVARCHAR](MAX)  NOT NULL,
    [ClientName] [NVARCHAR](MAX)  NOT NULL,
    [BrowserInfo] [NVARCHAR](MAX)  NOT NULL,
    [Exception] [NVARCHAR](MAX)  NOT NULL
)

CREATE TABLE [AppEnterprise]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [LangName] [NVARCHAR](200)  NOT NULL,
    [Code] [NVARCHAR](200)  NOT NULL,
    [Address] [NVARCHAR](200)  NOT NULL,
    [Contact] [NVARCHAR](200)  NOT NULL,
    [CellPhone] [NVARCHAR](200)  NOT NULL,
    [Email] [NVARCHAR](200)  NOT NULL,
    [Memo] [NVARCHAR](MAX)  NOT NULL,
    [IsActive] [BIT]  null,
    [IsDeleted] [BIT]  null,
    [DisplayOrder] [INT]  null,
    [CreationTime] [DATETIME]  null,
    [CreatorUserId] [NVARCHAR](50)  NOT NULL
)

CREATE TABLE [AppUser]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [Account] [NVARCHAR](100)  NOT NULL,
    [Password] [NVARCHAR](100)  NOT NULL,
    [UserName] [NVARCHAR](100)  NOT NULL,
    [EmailAddress] [NVARCHAR](100)  NOT NULL,
    [LangName] [NVARCHAR](100)  NOT NULL,
    [Language] [NVARCHAR](100)  NOT NULL,
    [CellPhone] [NVARCHAR](100)  NOT NULL,
    [IsActive] [BIT]  null,
    [IsOut] [BIT]  null,
    [IsDeleted] [BIT]  null,
    [CreationTime] [DATETIME]  null,
    [CreatorUserId] [NVARCHAR](50)  NOT NULL
)

CREATE TABLE [BpmReport]
(
    [LangName] [NVARCHAR](MAX)  NOT NULL,
    [LangDescription] [NVARCHAR](MAX)  NOT NULL,
    [Type] [NVARCHAR](MAX)  NOT NULL,
    [DisplayOrder] [INT]  NOT NULL,
    [ParentReportId] [NVARCHAR](MAX)  NOT NULL,
    [EnterpriseId] [NVARCHAR](MAX)  NOT NULL,
    [CreationTime] [DATETIME]  null,
    [CreatorUserId] [NVARCHAR](50)  NOT NULL,
    [Id] [NVARCHAR](50)  PRIMARY KEY
)

CREATE TABLE [BpmViewTable]
(
    [SchemaName] [NVARCHAR](MAX)  NOT NULL,
    [DisplayOrder] [INT]  NOT NULL,
    [LangName] [NVARCHAR](MAX)  NOT NULL,
    [LangDescription] [NVARCHAR](MAX)  NOT NULL,
    [DataSql] [NVARCHAR](MAX)  NOT NULL,
    [ParentViewTableId] [NVARCHAR](MAX)  NOT NULL,
    [EnterpriseId] [NVARCHAR](MAX)  NOT NULL,
    [CreationTime] [DATETIME]  null,
    [CreatorUserId] [NVARCHAR](50)  NOT NULL,
    [Id] [NVARCHAR](50)  PRIMARY KEY
)

CREATE TABLE [BpmBusinessTable]
(
    [Type] [NVARCHAR](MAX)  NOT NULL,
    [SchemaName] [NVARCHAR](MAX)  NOT NULL,
    [DisplayOrder] [INT]  NOT NULL,
    [LangName] [NVARCHAR](MAX)  NOT NULL,
    [LangDescription] [NVARCHAR](MAX)  NOT NULL,
    [ParentBusinessTableId] [NVARCHAR](MAX)  NOT NULL,
    [EnterpriseId] [NVARCHAR](MAX)  NOT NULL,
    [CreationTime] [DATETIME]  null,
    [CreatorUserId] [NVARCHAR](50)  NOT NULL,
    [Id] [NVARCHAR](50)  PRIMARY KEY
)

CREATE TABLE [BpmViewTableColumns]
(
    [LangName] [NVARCHAR](MAX)  NOT NULL,
    [SchemaName] [NVARCHAR](MAX)  NOT NULL,
    [Type] [NVARCHAR](MAX)  NOT NULL,
    [Alignment] [NVARCHAR](MAX)  NOT NULL,
    [IsDisplayEnable] [BIT]  NOT NULL,
    [IsLinkEnable] [BIT]  NOT NULL,
    [WhereInputType] [NVARCHAR](MAX)  NOT NULL,
    [WhereInputContent] [NVARCHAR](MAX)  NOT NULL,
    [IsWhereEnable] [BIT]  NOT NULL,
    [IsOrderByEnable] [BIT]  NOT NULL,
    [IsGroupByEnable] [BIT]  NOT NULL,
    [IsAggregateEnable] [BIT]  NOT NULL,
    [DisplayOrder] [INT]  NOT NULL,
    [ViewTableId] [NVARCHAR](MAX)  NOT NULL,
    [EnterpriseId] [NVARCHAR](MAX)  NOT NULL,
    [IsDelete] [BIT]  NOT NULL,
    [Id] [NVARCHAR](50)  PRIMARY KEY
)

CREATE TABLE [BpmBusinessTableColumns]
(
    [LangName] [NVARCHAR](MAX)  NOT NULL,
    [SchemaName] [NVARCHAR](MAX)  NOT NULL,
    [Type] [NVARCHAR](MAX)  NOT NULL,
    [MaxLength] [NVARCHAR](MAX)  NOT NULL,
    [IsRequired] [NVARCHAR](MAX)  NOT NULL,
    [Alignment] [NVARCHAR](MAX)  NOT NULL,
    [IsDisplayEnable] [BIT]  NOT NULL,
    [DataInputType] [NVARCHAR](MAX)  NOT NULL,
    [DataInputContent] [NVARCHAR](MAX)  NOT NULL,
    [IsLinkEnable] [BIT]  NOT NULL,
    [WhereInputType] [NVARCHAR](MAX)  NOT NULL,
    [WhereInputContent] [NVARCHAR](MAX)  NOT NULL,
    [IsWhereEnable] [BIT]  NOT NULL,
    [IsOrderByEnable] [BIT]  NOT NULL,
    [IsGroupByEnable] [BIT]  NOT NULL,
    [IsAggregateEnable] [BIT]  NOT NULL,
    [DisplayOrder] [INT]  NOT NULL,
    [BusinessTableId] [NVARCHAR](MAX)  NOT NULL,
    [EnterpriseId] [NVARCHAR](MAX)  NOT NULL,
    [Id] [NVARCHAR](50)  PRIMARY KEY
)

CREATE TABLE [BpmEnum]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [Name] [NVARCHAR](512)  NOT NULL,
    [Value] [NVARCHAR](512)  NOT NULL,
    [Enum] [NVARCHAR](512)  NOT NULL,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL
)

CREATE TABLE [BpmGroup]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [LangName] [NVARCHAR](200)  NOT NULL,
    [ParentGroupId] [NVARCHAR](100)  NOT NULL,
    [EnumGroupType] [NVARCHAR](100)  NOT NULL,
    [Area] [NVARCHAR](100)  NOT NULL,
    [Memo] [NVARCHAR](1000)  NOT NULL,
    [DisplayOrder] [INT]  null,
    [Code] [NVARCHAR](20)  NOT NULL,
    [EnumGroupLevel] [NVARCHAR](20)  NOT NULL,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL,
    [IsRoot] [BIT]  null
)

CREATE TABLE [BpmJob]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [Code] [NVARCHAR](MAX)  NOT NULL,
    [LangName] [NVARCHAR](MAX)  NOT NULL,
    [Type] [NVARCHAR](MAX)  NOT NULL,
    [EnumJobLevel] [NVARCHAR](MAX)  NOT NULL,
    [IsPrimary] [NVARCHAR](MAX)  NOT NULL,
    [IsLeader] [NVARCHAR](MAX)  NOT NULL,
    [GroupId] [NVARCHAR](MAX)  NOT NULL,
    [ParentJobId] [NVARCHAR](MAX)  NOT NULL,
    [SubGroupId] [NVARCHAR](MAX)  NOT NULL,
    [DisplayOrder] [INT]  NOT NULL,
    [EnterpriseId] [NVARCHAR](MAX)  NOT NULL
)

CREATE TABLE [BpmJobUser]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [JobId] [NVARCHAR](100)  NOT NULL,
    [UserId] [NVARCHAR](100)  NOT NULL,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL
)

CREATE TABLE [BpmRoleJob]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [RoleId] [NVARCHAR](100)  NOT NULL,
    [JobId] [NVARCHAR](100)  NOT NULL,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL,
    [DisplayOrder] [INT]  null
)

CREATE TABLE [BpmRole]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [Code] [NVARCHAR](100)  NOT NULL,
    [LangName] [NVARCHAR](100)  NOT NULL,
    [DisplayOrder] [INT]  null,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL,
    [CreationTime] [DATETIME]  null
)

CREATE TABLE [BpmUser]
(
    [Account] [NVARCHAR](MAX)  NOT NULL,
    [LangName] [NVARCHAR](MAX)  NOT NULL,
    [Language] [NVARCHAR](MAX)  NOT NULL,
    [IsOut] [NVARCHAR](MAX)  NOT NULL,
    [EnterpriseId] [NVARCHAR](MAX)  NOT NULL,
    [IsDeleted] [NVARCHAR](MAX)  NOT NULL,
    [Id] [NVARCHAR](50)  PRIMARY KEY
)

CREATE TABLE [InstAgent]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [UserId] [NVARCHAR](100)  NOT NULL,
    [WfdCategoryId] [NVARCHAR](100)  NOT NULL,
    [WfdWorkflowId] [NVARCHAR](100)  NOT NULL,
    [UseJob] [INT]  null,
    [FirstUserId] [NVARCHAR](100)  NOT NULL,
    [SecondUserId] [NVARCHAR](100)  NOT NULL,
    [StartDateTime] [DATETIME]  null,
    [EndDateTime] [DATETIME]  null,
    [Enable] [BIT]  NOT NULL,
    [Order] [INT]  null,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL,
    [CreationTime] [DATETIME]  null,
    [CreatorUserId] [NVARCHAR](50)  NOT NULL
)

CREATE TABLE [InstTaskMark]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [ByUserId] [NVARCHAR](100)  NOT NULL,
    [TaskId] [NVARCHAR](100)  NOT NULL,
    [CreationTime] [DATETIME]  null,
    [Reason] [NVARCHAR](400)  NOT NULL,
    [IsMarked] [BIT]  null,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL
)

CREATE TABLE [InstDataOperateLogs]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [OperateType] [INT]  NOT NULL,
    [UserId] [NVARCHAR](50)  NOT NULL,
    [Datetime] [DATETIME]  null,
    [DataId] [NVARCHAR](50)  NOT NULL,
    [DataContent] [NVARCHAR](500)  NOT NULL,
    [DataMemo] [NVARCHAR](500)  NOT NULL
)

CREATE TABLE [InstDraft]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [ProcId] [NVARCHAR](MAX)  NOT NULL,
    [OwnerUserId] [NVARCHAR](MAX)  NOT NULL,
    [OwnerJobId] [NVARCHAR](MAX)  NOT NULL,
    [Topic] [NVARCHAR](MAX)  NOT NULL,
    [CreationTime] [DATETIME]  NOT NULL,
    [LastModificationTime] [DATETIME]  null,
    [Priority] [INT]  NOT NULL,
    [FormData] [NVARCHAR](MAX)  NOT NULL,
    [Type] [INT]  null,
    [WfdWorkflowId] [NVARCHAR](50)  NOT NULL,
    [WfdCategoryId] [NVARCHAR](50)  NOT NULL,
    [EnterpriseId] [NVARCHAR](50)  NOT NULL
)

CREATE TABLE [InstMail]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [FromUserId] [NVARCHAR](50)  NOT NULL,
    [ToUserId] [NVARCHAR](50)  NOT NULL,
    [ToMail] [NVARCHAR](500)  NOT NULL,
    [MailCc] [NVARCHAR](1000)  NOT NULL,
    [MailType] [INT]  null,
    [WfdWorkflowId] [NVARCHAR](50)  NOT NULL,
    [FromNodeName] [NVARCHAR](100)  NOT NULL,
    [ToNodeName] [NVARCHAR](100)  NOT NULL,
    [Memo] [NVARCHAR](MAX)  NOT NULL,
    [Subject] [NVARCHAR](200)  NOT NULL,
    [Body] [NVARCHAR](MAX)  NOT NULL,
    [Attachment] [NVARCHAR](200)  NOT NULL,
    [FormProcId] [NVARCHAR](50)  NOT NULL,
    [ProcId] [NVARCHAR](50)  NOT NULL,
    [TaskId] [NVARCHAR](50)  NOT NULL,
    [CreationTime] [DATETIME]  null,
    [SendTime] [DATETIME]  null,
    [SendStatus] [INT]  null,
    [EnterpriseId] [NVARCHAR](50)  NOT NULL
)

CREATE TABLE [InstProc]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [RefId] [INT]  NOT NULL,
    [TaskId] [NVARCHAR](50)  NOT NULL,
    [NodeType] [INT]  null,
    [WfdWorkflowNodeId] [NVARCHAR](50)  NOT NULL,
    [RecvTime] [DATETIME]  null,
    [ProcTime] [DATETIME]  null,
    [ProcUser] [NVARCHAR](50)  NOT NULL,
    [ProcJobId] [NVARCHAR](50)  NOT NULL,
    [ProcOwner] [NVARCHAR](50)  NOT NULL,
    [ProcOwnerJobId] [NVARCHAR](50)  NOT NULL,
    [Status] [INT]  null,
    [Note] [NVARCHAR](MAX)  NOT NULL,
    [LastInformTime] [DATETIME]  null,
    [InformBeginTime] [DATETIME]  null,
    [InformIntervalTime] [NVARCHAR](50)  NOT NULL,
    [OvertimeActionBeginTime] [DECIMAL](12,4)  null,
    [FormFile] [NVARCHAR](200)  NOT NULL,
    [IsWating] [INT]  null,
    [ProcNodeUserOrder] [INT]  null,
    [Action] [NVARCHAR](50)  NOT NULL,
    [Priority] [INT]  null,
    [WaitingDays] [INT]  null,
    [OverDateAutoExecute] [INT]  null,
    [Type] [INT]  null,
    [EnterpriseId] [NVARCHAR](50)  NOT NULL
)

CREATE TABLE [InstProcLink]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [TaskId] [NVARCHAR](50)  NOT NULL,
    [ProcIdFrom] [NVARCHAR](50)  NOT NULL,
    [ProcIdTo] [NVARCHAR](50)  NOT NULL
)

CREATE TABLE [InstSerial]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [Type] [NVARCHAR](50)  NOT NULL,
    [Prefix] [NVARCHAR](50)  NOT NULL,
    [Number] [INT]  null,
    [EnterpriseId] [NVARCHAR](50)  NOT NULL
)

CREATE TABLE [InstTaskCopy]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [ToUserId] [NVARCHAR](100)  NOT NULL,
    [FromUserId] [NVARCHAR](100)  NOT NULL,
    [TaskId] [NVARCHAR](100)  NOT NULL,
    [ProcId] [NVARCHAR](100)  NOT NULL,
    [CreationTime] [DATETIME]  null,
    [Reason] [NVARCHAR](400)  NOT NULL,
    [IsRead] [BIT]  null,
    [FormId] [NVARCHAR](100)  NOT NULL,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL
)

CREATE TABLE [InstShare]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [ShareUserId] [NVARCHAR](50)  NOT NULL,
    [TaskId] [NVARCHAR](50)  NOT NULL,
    [ShareTime] [DATETIME]  null,
    [Reason] [NVARCHAR](200)  NOT NULL,
    [FormFile] [NVARCHAR](50)  NOT NULL,
    [EnterpriseId] [NVARCHAR](50)  NOT NULL
)

CREATE TABLE [InstTask]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [RefId] [INT]  NOT NULL,
    [WfdCategoryId] [NVARCHAR](100)  NOT NULL,
    [WfdWorkflowId] [NVARCHAR](100)  NOT NULL,
    [CreateBy] [NVARCHAR](100)  NOT NULL,
    [CreateByJobId] [NVARCHAR](100)  NOT NULL,
    [CreateByGroupId] [NVARCHAR](100)  NOT NULL,
    [CreationTime] [DATETIME]  null,
    [FinishedTime] [DATETIME]  null,
    [Priority] [INT]  null,
    [Status] [INT]  null,
    [ParentTaskId] [NVARCHAR](100)  NOT NULL,
    [Memo] [NVARCHAR](MAX)  NOT NULL,
    [ConnectTable] [NVARCHAR](1000)  NOT NULL,
    [Site] [NVARCHAR](20)  NOT NULL,
    [Sn] [NVARCHAR](40)  NOT NULL,
    [Topic] [NVARCHAR](600)  NOT NULL,
    [RejectBy] [NVARCHAR](72)  NOT NULL,
    [ParentProcId] [NVARCHAR](100)  NOT NULL,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL,
    [FormFieldsJson] [NVARCHAR](16)  NOT NULL
)

CREATE TABLE [InstVariable]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [TaskId] [NVARCHAR](50)  NOT NULL,
    [VariableName] [NVARCHAR](50)  NOT NULL,
    [VariableValue] [NVARCHAR](MAX)  NOT NULL
)

CREATE TABLE [WfdCategory]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [Code] [NVARCHAR](100)  NOT NULL,
    [LangType] [NVARCHAR](100)  NOT NULL,
    [LangName] [NVARCHAR](100)  NOT NULL,
    [DisplayOrder] [INT]  NOT NULL,
    [FromUserId] [NVARCHAR](MAX)  NOT NULL,
    [EnterpriseId] [NVARCHAR](50)  NOT NULL,
    [CreatorUserId] [NVARCHAR](50)  NOT NULL
)

CREATE TABLE [WfdForm]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [Name] [NVARCHAR](50)  NOT NULL,
    [TableName] [NVARCHAR](100)  NOT NULL,
    [Description] [NVARCHAR](MAX)  NOT NULL,
    [FromWfdFormsId] [NVARCHAR](50)  NOT NULL,
    [MobileFormName] [NVARCHAR](100)  NOT NULL,
    [MobileHtml] [NVARCHAR](MAX)  NOT NULL,
    [MobileController] [NVARCHAR](MAX)  NOT NULL,
    [PcFormName] [NVARCHAR](100)  NOT NULL,
    [PcHtml] [NVARCHAR](MAX)  NOT NULL,
    [PcController] [NVARCHAR](MAX)  NOT NULL,
    [EnterpriseId] [NVARCHAR](50)  NOT NULL
)

CREATE TABLE [WfdWorkflow]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [FromWorkflowId] [NVARCHAR](100)  NOT NULL,
    [Code] [NVARCHAR](100)  NOT NULL,
    [LangName] [NVARCHAR](100)  NOT NULL,
    [DisplayOrder] [INT]  NOT NULL,
    [Memo] [NVARCHAR](500)  NOT NULL,
    [WfdCategoryId] [NVARCHAR](50)  NOT NULL,
    [Zoom] [REAL]  NOT NULL,
    [Width] [INT]  NOT NULL,
    [Height] [INT]  NOT NULL,
    [EnterpriseId] [NVARCHAR](50)  NOT NULL,
    [IsDeleted] [BIT]  NOT NULL,
    [CreationTime] [DATETIME]  null,
    [CreatorUserId] [NVARCHAR](50)  NOT NULL
)

CREATE TABLE [WfdWorkflowLink]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [StartNodeId] [NVARCHAR](50)  NOT NULL,
    [EndNodeId] [NVARCHAR](50)  NOT NULL,
    [UseCondition] [BIT]  null,
    [ConditionValue] [NVARCHAR](500)  NOT NULL,
    [LangMemo] [NVARCHAR](500)  NOT NULL,
    [WfdWorkflowId] [NVARCHAR](50)  NOT NULL,
    [LineType] [NVARCHAR](20)  NOT NULL,
    [M] [REAL]  null,
    [EnterpriseId] [NVARCHAR](50)  NOT NULL
)

CREATE TABLE [WfdWorkflowLinkPoint]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [WfdWorkflowLinkId] [NVARCHAR](100)  NOT NULL,
    [DisplayOrder] [INT]  null,
    [X] [REAL]  null,
    [Y] [REAL]  null,
    [WfdWorkflowId] [NVARCHAR](100)  NOT NULL,
    [EnterpriseId] [NVARCHAR](MAX)  NOT NULL
)

CREATE TABLE [WfdWorkflowNode]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [Type] [INT]  null,
    [Code] [NVARCHAR](200)  NOT NULL,
    [LangName] [NVARCHAR](200)  NOT NULL,
    [WfdFormId] [NVARCHAR](100)  NOT NULL,
    [DisplayOrder] [INT]  null,
    [Memo] [NVARCHAR](1000)  NOT NULL,
    [IsEntryEnable] [BIT]  null,
    [EntryCondition] [NVARCHAR](2000)  NOT NULL,
    [ActionLinkId] [NVARCHAR](100)  NOT NULL,
    [ProcessType] [INT]  null,
    [ProcessorLinkId] [NVARCHAR](1000)  NOT NULL,
    [JumpTypeBinary] [NVARCHAR](200)  NOT NULL,
    [JumpNodeId] [NVARCHAR](1000)  NOT NULL,
    [CopyLinkId] [NVARCHAR](100)  NOT NULL,
    [InformLinkId] [NVARCHAR](100)  NOT NULL,
    [IsOvertimeInformEnable] [BIT]  null,
    [OvertimeBeginTime] [NVARCHAR](100)  NOT NULL,
    [OvertimeIntervalTime] [NVARCHAR](100)  NOT NULL,
    [OvertimeInformLinkId] [NVARCHAR](100)  NOT NULL,
    [IsOvertimeActionEnable] [BIT]  null,
    [OvertimeActionTime] [NVARCHAR](100)  NOT NULL,
    [OvertimeActionType] [INT]  null,
    [IsExamineEnable] [BIT]  null,
    [ExamineStandardTime] [NVARCHAR](100)  NOT NULL,
    [AutoCallType] [INT]  null,
    [AutoCallValue] [NVARCHAR](1000)  NOT NULL,
    [SubWorkflowId] [NVARCHAR](1000)  NOT NULL,
    [WfdWorkflowId] [NVARCHAR](100)  NOT NULL,
    [X] [REAL]  null,
    [Y] [REAL]  null,
    [Width] [REAL]  NOT NULL,
    [Height] [REAL]  NOT NULL,
    [ShapeType] [INT]  NOT NULL,
    [ImageSrc] [NVARCHAR](1000)  NOT NULL,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL
)

CREATE TABLE [WfdWorkflowNodeAction]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [Type] [NVARCHAR](100)  NOT NULL,
    [LangName] [NVARCHAR](100)  NOT NULL,
    [IsEnable] [BIT]  null,
    [ReturnToNodes] [NVARCHAR](2000)  NOT NULL,
    [ActionLinkId] [NVARCHAR](100)  NOT NULL,
    [DisplayOrder] [INT]  null,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL
)

CREATE TABLE [WfdWorkflowNodeCopyConfig]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [ActionType] [NVARCHAR](100)  NOT NULL,
    [CopyLinkId] [NVARCHAR](100)  NOT NULL,
    [ProcessorLinkId] [NVARCHAR](100)  NOT NULL,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL
)

CREATE TABLE [WfdWorkflowNodeInformConfig]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [ActionType] [NVARCHAR](100)  NOT NULL,
    [SendWay] [NVARCHAR](100)  NOT NULL,
    [InformLinkId] [NVARCHAR](100)  NOT NULL,
    [ProcessorLinkId] [NVARCHAR](100)  NOT NULL,
    [InformTemplateId] [NVARCHAR](100)  NOT NULL,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL
)

CREATE TABLE [WfdWorkflowObject]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [Type] [INT]  null,
    [ShapeType] [INT]  NOT NULL,
    [LangText] [NVARCHAR](100)  NOT NULL,
    [X] [REAL]  null,
    [Y] [REAL]  null,
    [Width] [REAL]  null,
    [Height] [REAL]  null,
    [TextStyle] [NVARCHAR](4000)  NOT NULL,
    [ImageSrc] [NVARCHAR](1000)  NOT NULL,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL,
    [WfdWorkflowId] [NVARCHAR](100)  NOT NULL
)

CREATE TABLE [WfdWorkflowProcessor]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [ProcessorLinkId] [NVARCHAR](100)  NOT NULL,
    [Type] [NVARCHAR](100)  NOT NULL,
    [Processor] [NVARCHAR](16)  NOT NULL,
    [ActiveCondition] [NVARCHAR](16)  NOT NULL,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL
)

CREATE TABLE [WfdWorkflowRight]
(
    [Id] [NVARCHAR](50)  PRIMARY KEY,
    [ValueType] [NVARCHAR](100)  NOT NULL,
    [Value] [NVARCHAR](1000)  NOT NULL,
    [ValueDisplay] [NVARCHAR](1000)  NOT NULL,
    [Allow] [NVARCHAR](MAX)  NOT NULL,
    [Forbid] [NVARCHAR](MAX)  NOT NULL,
    [WfdWorkflowId] [NVARCHAR](100)  NOT NULL,
    [EnterpriseId] [NVARCHAR](100)  NOT NULL,
    [CreationTime] [DATETIME]  NOT NULL,
    [CreatorUserId] [INT]  null
)
