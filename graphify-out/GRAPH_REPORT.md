# Graph Report - efac_frontend  (2026-08-13)

## Corpus Check
- 509 files · ~276,499 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2332 nodes · 6893 edges · 200 communities (117 shown, 83 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bed836aa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NewReturnForm.tsx
- tooltip.tsx
- dialog.tsx
- AdvancedOptionsSection.tsx
- Sidebar.tsx
- NewQuoteSettingsDrawer.tsx
- invoice/table/columns.tsx
- cn
- sidebar.tsx
- NewReturnForm.backup.tsx
- QuoteTable.tsx
- ApiResponse
- dashboard/page.tsx
- auth-context.tsx
- button.tsx
- devDependencies
- useResolutions
- compilerOptions
- showToast
- types/items.ts
- NewRemissionMain.tsx
- components.json
- CreditNotesService
- ReturnsTableBody.tsx
- CostCenterTable.tsx
- lib/utils.ts
- invoices/new/page.tsx
- ui/utils.ts
- PaymentTable.tsx
- react
- QuoteItemsTable.tsx
- quote.ts
- useQuotes.ts
- InvoicesService
- remission.ts
- contacts/page.tsx
- items/[id]/page.tsx
- invoice.ts
- cn
- NewItemModal.tsx
- contacts/[id]/page.tsx
- returns/[id]/page.tsx
- ResolutionTable.tsx
- context-menu.tsx
- types/catalogs.ts
- AddContactModal.tsx
- payments/[id]/page.tsx
- tasks/page.tsx
- ItemTable.tsx
- invoices/[id]/page.tsx
- invoice/table/FilterChips.tsx
- carousel.tsx
- dependencies
- InvoiceTable.tsx
- remissions/[id]/edit/page.tsx
- AuthService
- ResolutionForm.tsx
- Extraction Subagent Prompt Template
- CalculationService (Backend)
- useInvoices.ts
- QuickCreateItemModal.tsx
- useCatalogs
- ExportItemsModal.tsx
- PaymentDetailTabs.tsx
- drawer.tsx
- navigation-menu.tsx
- exports.md Reference Guide
- ReportsSections.tsx
- CertificateList.tsx
- ItemFilterChips.tsx
- chart.tsx
- pagination.tsx
- --update / --cluster-only subcommands (SKILL.md pointer)
- NewReturnForm
- softwares.ts
- ItemDetailView.tsx
- /graphify Full Pipeline
- graphify Knowledge Graph System
- query.md Reference Guide
- CompanySummaryCard.tsx
- skeleton.tsx
- toggle-group.tsx
- tenant.ts
- update.md Reference Guide
- widget.interface.ts
- invoices/page.tsx
- cotizaciones/page.tsx
- package.json
- useAuth
- github-and-merge.md Reference Guide
- AddGraphMenu.tsx
- breadcrumb.tsx
- PaymentDetailInfo.tsx
- catalogCache.ts
- hooks.md Reference Guide
- transcribe.md Reference Guide
- Next.js Project (create-next-app bootstrap)
- MonthSelector.tsx
- CuentasPorCobrarWidget.tsx
- CuentasPorPagarWidget.tsx
- PaymentInvoicesList.tsx
- invoice/InvoiceItemsTable.tsx
- InvoiceDetailPage
- alert.tsx
- next.config.ts
- contacts/layout.tsx
- dashboard/layout.tsx
- invoices/layout.tsx
- invoices/new/layout.tsx
- items/layout.tsx
- payments/new/layout.tsx
- EmptyDashboardState.tsx
- EmptyStateWidget.tsx
- ProductosVendidosSimpleWidget.tsx
- DocumentTitleUpdater.tsx
- Loader.tsx
- proxy.ts
- class-variance-authority
- clsx
- input-otp.tsx
- DeleteWidgetDialog.tsx
- @dnd-kit/core
- @dnd-kit/modifiers
- @dnd-kit/sortable
- @dnd-kit/utilities
- embla-carousel-react
- eslint.config.mjs
- geist
- @hookform/resolvers
- html2canvas
- input-otp
- ClientesConVentasWidget.tsx
- next
- DevolucionesWidget.tsx
- radix-ui
- @radix-ui/react-accordion
- ImpuestosWidget.tsx
- @radix-ui/react-checkbox
- @radix-ui/react-dialog
- SolutionsPopover.tsx
- @radix-ui/react-label
- @radix-ui/react-progress
- dayjs
- next-themes
- @radix-ui/react-slot
- @radix-ui/react-tabs
- @radix-ui/react-toggle
- @radix-ui/react-toggle-group
- @radix-ui/react-tooltip
- react-day-picker
- react-dom
- react-qr-code
- react-resizable-panels
- recharts
- sonner
- react-hook-form
- tailwind-merge
- tailwindcss-animate
- @tanstack/query-sync-storage-persister
- @radix-ui/react-switch
- @tanstack/react-query-persist-client
- @tanstack/react-table
- vaul
- zod
- postcss.config.mjs
- afleones (User/Author Persona)
- globals.css.d.ts
- global.d.ts
- newInvoiceMockData.ts
- FactuCore Logo
- Login Page Illustration (Facturación Electrónica)
- @tabler/icons-react
- @tanstack/react-query
- prompt.md
- @radix-ui/react-select
- providers.tsx
- @radix-ui/react-separator
- certificates/page.tsx
- @radix-ui/react-slider
- @radix-ui/react-switch
- Ajuste de flujo: emisión de facturas y notas crédito ahora es asíncrona
- @tabler/icons-react
- @tanstack/react-query
- PaymentInvoicesList.tsx
- NewInvoiceView.tsx
- ClientesConVentasWidget.tsx
- softwares.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 198 edges
2. `showToast()` - 192 edges
3. `cn()` - 139 edges
4. `react` - 114 edges
5. `Button()` - 106 edges
6. `DialogContent()` - 52 edges
7. `DialogTitle()` - 52 edges
8. `Dialog()` - 51 edges
9. `DialogHeader()` - 49 edges
10. `useCatalogs()` - 49 edges

## Surprising Connections (you probably didn't know these)
- `CertificatesPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/certificates/page.tsx → package.json
- `SoftwarePage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/software/page.tsx → package.json
- `ContactPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/contacts/page.tsx → package.json
- `QuotesPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/cotizaciones/page.tsx → package.json
- `InvoicesPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/invoices/page.tsx → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Modular Reference-Doc Loading Pattern** — claude_skills_graphify_skill_step0_github_merge, claude_skills_graphify_skill_step2_5_transcribe, claude_skills_graphify_skill_part_b_semantic_extraction, claude_skills_graphify_skill_update_cluster_only, claude_skills_graphify_skill_query_flow, claude_skills_graphify_skill_add_watch_flow, claude_skills_graphify_skill_hooks_integration, claude_skills_graphify_skill_exports_flow [INFERRED 0.85]
- **Self-Improving Query Feedback Loop (save-result + reflect)** — claude_skills_graphify_references_query_query_command, claude_skills_graphify_references_query_path_command, claude_skills_graphify_references_query_explain_command, claude_skills_graphify_references_query_save_result_command, claude_skills_graphify_references_query_reflect_command [EXTRACTED 1.00]
- **Incremental Update Manifest & Merge Integrity Guards** — claude_skills_graphify_references_update_update_flag, claude_skills_graphify_references_update_build_merge_function, claude_skills_graphify_skill_step9_cleanup_report [INFERRED 0.75]
- **Credit Note Types Using Line-Level Adjustments with CalculationService** — payload_examples_type1, payload_examples_type3, payload_examples_type4, payload_examples_type5, payload_examples_calculation_service [INFERRED 0.85]
- **graphify CLI Subcommands** — claude_md_graphify_query, claude_md_graphify_path, claude_md_graphify_explain, claude_md_graphify_update [EXTRACTED 1.00]

## Communities (200 total, 83 thin omitted)

### Community 0 - "NewReturnForm.tsx"
Cohesion: 0.16
Nodes (24): CertificateListProps, ContactTableBodyProps, InvoiceDetailDocument(), InvoiceDetailDocumentProps, DianStatusBadge(), InvoiceTableBody(), InvoiceTableBodyProps, ItemTableBodyProps (+16 more)

### Community 1 - "tooltip.tsx"
Cohesion: 0.13
Nodes (27): ContactAdvancedFormProps, ContactCommercialInfo(), ContactCommercialInfoProps, NewCostCenterModal(), NewCurrencyModal(), FlujoTransaccionesData, FlujoTransaccionesWidgetProps, TotalVentasWidgetProps (+19 more)

### Community 2 - "dialog.tsx"
Cohesion: 0.07
Nodes (37): AttributeModalProps, NewCertificateModalProps, ConfigCostCentersModalProps, DOCUMENT_TYPES, CostCenter, NewCostCenterModalProps, CreateCurrencyModalProps, ProductGalleryModalProps (+29 more)

### Community 3 - "AdvancedOptionsSection.tsx"
Cohesion: 0.11
Nodes (19): useChangeEmail(), useVerifyPassword(), ProfileService, ChangeEmailPayload, ChangePasswordPayload, DeviceSession, LoginRequires2FA, ProfileMaster (+11 more)

### Community 4 - "Sidebar.tsx"
Cohesion: 0.18
Nodes (12): Header(), Logo(), CollapseButton(), MenuItem(), MenuItemProps, Sidebar(), SidebarMenuItem, SidebarMenuItems() (+4 more)

### Community 5 - "NewQuoteSettingsDrawer.tsx"
Cohesion: 0.13
Nodes (36): FactucoreLogo(), FactucoreLogoProps, AddContactModal(), ContactAccountingInfo(), ContactAccountingInfoProps, EditResolutionModal(), InvoiceItemsTable(), QuickCreateItemModal() (+28 more)

### Community 6 - "invoice/table/columns.tsx"
Cohesion: 0.13
Nodes (19): NewCertificateForm(), NewCertificateFormProps, InvoiceDetailHeaderProps, RemissionDetailHeader(), RemissionDetailHeaderProps, ActionsCell(), isRemissionInvoiced(), StatusBadge() (+11 more)

### Community 7 - "cn"
Cohesion: 0.15
Nodes (18): MODULES, PermissionGroupCard(), RolePermissionsPage(), Tabs(), TabsContent(), TabsList(), TabsTrigger(), ACCESS_LABEL (+10 more)

### Community 8 - "sidebar.tsx"
Cohesion: 0.06
Nodes (36): Separator(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle() (+28 more)

### Community 9 - "NewReturnForm.backup.tsx"
Cohesion: 0.24
Nodes (6): RemissionDetailDocument(), RemissionDetailExtraInfo(), RemissionDetailExtraInfoProps, RemissionDetailSkeleton(), RemissionDetailSummary(), RemissionDetailSummaryProps

### Community 10 - "QuoteTable.tsx"
Cohesion: 0.21
Nodes (7): QuoteDetailExtraInfo(), QuoteDetailExtraInfoProps, QuoteDetailHeader(), QuoteDetailSkeleton(), QuoteDetailSummary(), QuoteDetailSummaryProps, CommentsAndReminders()

### Community 11 - "ApiResponse"
Cohesion: 0.14
Nodes (6): CONTACTS_KEY, categoriesApi, PaymentTermsService, priceListsApi, SellersService, ApiResponse

### Community 12 - "dashboard/page.tsx"
Cohesion: 0.12
Nodes (21): DashboardPage(), isPredefinedWidget(), PREDEFINED_POSITIONS, SortableWidgetProps, Widget, FlujoTransaccionesWidget(), TotalVentasWidget(), WidgetSkeleton() (+13 more)

### Community 13 - "auth-context.tsx"
Cohesion: 0.10
Nodes (14): CompanySummaryCard(), ConfigCard(), ConfigCardProps, ConfigLink, ConfigurationGrid(), AccountSwitcher(), AccountSwitcherProps, HelpCenterPopover() (+6 more)

### Community 14 - "button.tsx"
Cohesion: 0.07
Nodes (39): Factucore Horizontal Logo, ContactDetailHeaderProps, CostCenterFilterProps, FilterOption, HeaderProps, SolutionsPopover(), SolutionsPopoverProps, InvoicePageHeaderProps (+31 more)

### Community 15 - "devDependencies"
Cohesion: 0.06
Nodes (32): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, shadcn (+24 more)

### Community 16 - "useResolutions"
Cohesion: 0.20
Nodes (18): CustomFieldModalProps, FALLBACK_FIELD_TYPES, AsyncSearchableSelectOption, AsyncSearchableSelectProps, Calendar(), CalendarDayButton(), Command(), CommandEmpty() (+10 more)

### Community 17 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 18 - "showToast"
Cohesion: 0.19
Nodes (9): ItemDetailPage(), ItemsPage(), ItemAccounting(), ItemAttachments(), ItemHeader(), ItemInventory(), ItemInventoryProps, useDeleteItem() (+1 more)

### Community 19 - "types/items.ts"
Cohesion: 0.08
Nodes (30): Image, BaseItemBasicInfo, BaseItemPayload, ComboBasicInfo, ComboItemPayload, CreateItemAccounting, CreateItemComboComponent, CreateItemComboSettings (+22 more)

### Community 20 - "NewRemissionMain.tsx"
Cohesion: 0.08
Nodes (41): ItemImage, CategoryModalProps, NewCategoryModal(), CustomFieldModal(), BLANK_BASIC, QuickCreateItemModalProps, AccountingSection(), AdditionalFieldsSection() (+33 more)

### Community 21 - "components.json"
Cohesion: 0.08
Nodes (23): aliases, components, hooks, lib, ui, utils, Authorization, iconLibrary (+15 more)

### Community 22 - "CreditNotesService"
Cohesion: 0.12
Nodes (14): ReturnDetailPage(), NewInvoiceComments(), WithholdingsModal(), ReturnDetailHeader(), ReturnDetailSkeleton(), CREDIT_NOTE_KEY(), CREDIT_NOTES_KEY, extractCreditNote() (+6 more)

### Community 23 - "ReturnsTableBody.tsx"
Cohesion: 0.13
Nodes (11): InvoiceDetailExtraInfo(), InvoiceDetailExtraInfoProps, InvoiceDetailHeader(), InvoiceDetailSkeleton(), InvoiceDetailSummary(), InvoiceDetailSummaryProps, InvoiceDetailTabs(), InvoiceDianStatus() (+3 more)

### Community 24 - "CostCenterTable.tsx"
Cohesion: 0.11
Nodes (21): CostCentersPage(), ConfigCostCentersModal(), CostCenterTable(), CostCenterTableProps, ServerPagination, CostCenter, getColumns(), CostCenterFilter() (+13 more)

### Community 25 - "lib/utils.ts"
Cohesion: 0.10
Nodes (20): InvoiceTableProps, InvoiceTableToolbar(), InvoiceTableToolbarProps, WithholdingsModalProps, NewWithholdingModalProps, AllowanceCharge, DianSubmissionStatus, InvoiceBill (+12 more)

### Community 26 - "invoices/new/page.tsx"
Cohesion: 0.47
Nodes (4): NewItemPage(), NewItemFormProps, useCreateItem(), CreateItemPayload

### Community 27 - "ui/utils.ts"
Cohesion: 0.07
Nodes (32): AccordionContent(), AccordionItem(), AccordionTrigger(), AlertDialogOverlay(), Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis() (+24 more)

### Community 28 - "PaymentTable.tsx"
Cohesion: 0.10
Nodes (25): PaymentsPage(), PaymentTable(), PaymentTableProps, SelectionState, ServerPagination, getPaymentColumns(), filterLabels, MOCK_BANK_ACCOUNTS (+17 more)

### Community 29 - "react"
Cohesion: 0.24
Nodes (10): InvoiceEditPage(), extractInvoiceFromDetail(), INVOICE_KEY(), INVOICES_KEY, useInvoice(), usePrefetchInvoiceDetail(), useUpdateInvoice(), InvoiceDetailResponse (+2 more)

### Community 30 - "QuoteItemsTable.tsx"
Cohesion: 0.36
Nodes (10): ItemRow(), ItemRow(), ItemRow(), getComboAvailableUnits(), getComboComponents(), isComboItem(), isServiceItem(), requiresOwnStockCheck() (+2 more)

### Community 31 - "quote.ts"
Cohesion: 0.18
Nodes (4): InvoiceDetailPage(), useSendInvoice(), InvoicesService, Invoice

### Community 32 - "useQuotes.ts"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 33 - "InvoicesService"
Cohesion: 0.21
Nodes (8): UseItemsParams, ToggleStatusParams, itemsApi, PaginatedData, GetItemByIdResponse, ItemsListApiData, UpdateItemPayload, UpdateVariantPayload

### Community 34 - "remission.ts"
Cohesion: 0.12
Nodes (19): FacturasVentaViewProps, RemissionsPage(), RemissionFilter(), RemissionPageHeader(), RemissionTable(), RemissionTableProps, ServerPagination, getColumns() (+11 more)

### Community 35 - "contacts/page.tsx"
Cohesion: 0.13
Nodes (19): Contact, ContactPage(), ContactType, Contact, ContactTable(), ContactTableProps, SelectionState, ServerPagination (+11 more)

### Community 36 - "items/[id]/page.tsx"
Cohesion: 0.17
Nodes (9): DOCUMENT_TYPES, DocumentType, envs, DateRangeExportResult, exportByDateRange(), extractFilenameFromContentDisposition(), extractJsonMessage(), QuoteFindAllSuccess (+1 more)

### Community 37 - "invoice.ts"
Cohesion: 0.17
Nodes (14): NewInvoicePageContent(), ResolutionsPage(), getSession(), SessionData, NewInvoiceFooter(), NewInvoiceHeader(), NewInvoiceHeaderProps, NewInvoiceMain() (+6 more)

### Community 38 - "cn"
Cohesion: 0.28
Nodes (8): formatMoney(), getItemTypeName(), InfoChip(), InfoField(), ItemDetailView(), ItemDetailViewProps, StatusToggle(), TabButton()

### Community 39 - "NewItemModal.tsx"
Cohesion: 0.12
Nodes (18): ActivateAccountContent(), ConfirmEmailContent(), ForgotPasswordPage(), ResetPasswordContent(), AuthLinkStatus(), AuthLinkStatusProps, PasswordResetForm(), LogoHorizontal() (+10 more)

### Community 40 - "contacts/[id]/page.tsx"
Cohesion: 0.10
Nodes (18): ApiKeysTab(), CreateApiKeyModal(), CreateApiKeyModalProps, CreateWebhookModal(), RotateSecretModal(), RotateSecretModalProps, WebhookDeliveriesModal(), WebhookDeliveriesModalProps (+10 more)

### Community 41 - "returns/[id]/page.tsx"
Cohesion: 0.07
Nodes (25): PaymentDetailPage(), NewPaymentPageContent(), PaymentDetailAccounting(), PaymentDetailAccountingAccounts(), PaymentDetailAccountingAccountsProps, PaymentDetailAdvances(), Attachment, PaymentDetailAttachments() (+17 more)

### Community 42 - "ResolutionTable.tsx"
Cohesion: 0.12
Nodes (23): EditResolutionPage(), NewResolutionPage(), EditResolutionModalProps, baseSchema, formSchema, ResolutionForm(), ResolutionFormProps, ResolutionTable() (+15 more)

### Community 43 - "context-menu.tsx"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 44 - "types/catalogs.ts"
Cohesion: 0.12
Nodes (16): contactFilterOptions, ContactTableToolbar(), ContactTableToolbarProps, FilterOption, defaultFilterOptions, FilterOption, InvoiceFilter(), InvoiceFilterProps (+8 more)

### Community 45 - "AddContactModal.tsx"
Cohesion: 0.12
Nodes (19): EditContactContent(), NewContactContent(), AddContactModalProps, ModalContent(), PrefilledContactData, ContactAdvancedForm(), ContactBasicForm(), ContactBasicFormProps (+11 more)

### Community 46 - "payments/[id]/page.tsx"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 47 - "tasks/page.tsx"
Cohesion: 0.16
Nodes (10): NewTaskDrawer(), NewTaskDrawerProps, ASSIGNEE_OPTIONS, FILTER_TABS, PRIORITY_OPTIONS, STATUS_OPTIONS, TaskFiltersPopup(), TaskFiltersPopupProps (+2 more)

### Community 48 - "ItemTable.tsx"
Cohesion: 0.10
Nodes (19): FormState, ReturnsPage(), ItemTable(), ItemTableProps, SelectionState, ServerPagination, getItemColumns(), filterLabels (+11 more)

### Community 49 - "invoices/[id]/page.tsx"
Cohesion: 0.11
Nodes (6): NewRemissionOptions(), ApiClient, AttributePayload, attributesApi, CreditNoteType, currenciesApi

### Community 50 - "invoice/table/FilterChips.tsx"
Cohesion: 0.33
Nodes (6): CompanyProfileForm(), getInitials(), useUpdateCompanyProfile(), CompanyProfileService, CompanyProfileUpdatePayload, CompanyProfileUpdateResponse

### Community 51 - "carousel.tsx"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 52 - "dependencies"
Cohesion: 0.13
Nodes (15): class-variance-authority, @dnd-kit/modifiers, @dnd-kit/utilities, geist, dependencies, class-variance-authority, @dnd-kit/modifiers, @dnd-kit/utilities (+7 more)

### Community 53 - "InvoiceTable.tsx"
Cohesion: 0.23
Nodes (9): InvoiceTable(), ServerPagination, getColumns(), FilterChips(), filterValueToColumnId, InvoiceTablePagination(), InvoiceTablePaginationProps, ServerPagination (+1 more)

### Community 54 - "remissions/[id]/edit/page.tsx"
Cohesion: 0.09
Nodes (29): EditQuotePage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), QuoteDetailPage(), NewQuotePageContent(), NewQuoteFooter(), NewQuoteHeader(), NewQuoteHeaderProps (+21 more)

### Community 55 - "AuthService"
Cohesion: 0.32
Nodes (11): formatMoney(), getClientName(), getDocDate(), getDocNumber(), getDocStatus(), getDocTotal(), ItemDocumentsTab(), resolveDoc() (+3 more)

### Community 56 - "ResolutionForm.tsx"
Cohesion: 0.23
Nodes (11): FormControl(), FormDescription(), FormField(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue (+3 more)

### Community 57 - "Extraction Subagent Prompt Template"
Cohesion: 0.18
Nodes (11): Confidence Score Rubric (EXTRACTED/INFERRED/AMBIGUOUS), extraction-spec.md Reference Guide, Hyperedge Extraction Rule, Node ID Format Spec ({stem}_{entity}), semantically_similar_to Edge Rule, Extraction Subagent Prompt Template, Honesty Rules, Part A: Structural (AST) extraction (+3 more)

### Community 58 - "CalculationService (Backend)"
Cohesion: 0.42
Nodes (11): CalculationService (Backend), Rationale: Frontend Must Not Send Monetary Amounts, credit_note_reference_index field, POST /api/credit-notes endpoint, POST /api/credit-notes/send endpoint, Tipo 1: Devolución Parcial (Ajuste de Cantidad), Tipo 2: Anulación Completa de la Factura, Tipo 3 y 6: Rebaja / Descuento a Líneas (+3 more)

### Community 59 - "useInvoices.ts"
Cohesion: 0.32
Nodes (3): NewReturnForm(), createEmptyLine(), NewReturnForm()

### Community 60 - "QuickCreateItemModal.tsx"
Cohesion: 0.12
Nodes (14): react, react, ContactTablePagination(), ContactTablePaginationProps, ServerPagination, FormattedInput(), FormattedInput(), FormattedInput() (+6 more)

### Community 61 - "useCatalogs"
Cohesion: 0.11
Nodes (11): HoverCardContent(), Progress(), ResizableHandle(), ResizablePanelGroup(), Slider(), Switch(), ToggleGroup(), ToggleGroupContext (+3 more)

### Community 62 - "ExportItemsModal.tsx"
Cohesion: 0.14
Nodes (16): AttributeModal(), ComboProductEntry, PriceListEntry, WarehouseEntry, ComboProductData, ProductComboModal(), ProductComboModalProps, SectionCard() (+8 more)

### Community 63 - "PaymentDetailTabs.tsx"
Cohesion: 0.10
Nodes (22): CompanyProfilePage(), AuthenticatedLayout(), LoginPage(), RootPage(), SplashScreen(), SplashScreenProps, UserMenu(), UserMenuProps (+14 more)

### Community 64 - "drawer.tsx"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 65 - "navigation-menu.tsx"
Cohesion: 0.60
Nodes (3): EditItemPage(), useItemById(), useUpdateItem()

### Community 66 - "exports.md Reference Guide"
Cohesion: 0.22
Nodes (9): Token reduction benchmark (Step 8), --falkordb / --falkordb-push export (Step 7a), --graphml export (Step 7c), exports.md Reference Guide, --mcp MCP stdio server (Step 7d), --neo4j / --neo4j-push export (Step 7), --svg export (Step 7b), --wiki export (Step 6b) (+1 more)

### Community 67 - "ReportsSections.tsx"
Cohesion: 0.33
Nodes (5): CategoryCard(), CategoryCardProps, ReportsCategoryGrid(), ReportsHeader(), ReportsSearchBar()

### Community 68 - "CertificateList.tsx"
Cohesion: 0.27
Nodes (8): SecurityPage(), ConnectedDevicesSection(), formatRelativeTime(), TwoFactorSection(), Skeleton(), useDevices(), useProfile(), useTwoFactorStatus()

### Community 69 - "ItemFilterChips.tsx"
Cohesion: 0.09
Nodes (30): EditRemissionPage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), RemissionDetailPage(), NewRemissionPageContent(), PreviewModal(), PreviewModalProps, NewRemissionFooter() (+22 more)

### Community 70 - "chart.tsx"
Cohesion: 0.14
Nodes (18): DistribucionGastosWidget(), DistribucionGastosWidgetProps, GastoItem, ClienteItem, MejoresClientesWidget(), MejoresClientesWidgetProps, ProductoItem, ProductosMasVendidosWidget() (+10 more)

### Community 71 - "pagination.tsx"
Cohesion: 0.14
Nodes (24): NewInvoiceOptions(), ChangeEmailDialog(), ChangePasswordDialog(), PasswordGateDialog(), RecoveryCodesDisplay(), RecoveryCodesDisplayProps, CodeMode, ENABLE_STEP_PROGRESS (+16 more)

### Community 72 - "--update / --cluster-only subcommands (SKILL.md pointer)"
Cohesion: 0.29
Nodes (7): /graphify add <url>, add-watch.md Reference Guide, --watch (background folder watcher), /graphify add and --watch flow (SKILL.md pointer), Interpreter guard for subcommands, /graphify query flow (SKILL.md pointer), --update / --cluster-only subcommands (SKILL.md pointer)

### Community 73 - "NewReturnForm"
Cohesion: 0.60
Nodes (4): getInitials(), UsersPage(), VALID_ROLES, UserInfoPanel()

### Community 74 - "softwares.ts"
Cohesion: 0.11
Nodes (28): PasswordResetFormProps, TwoFactorChallengeForm(), TwoFactorChallengeFormProps, ContactDetailBranchesProps, CreateWebhookModalProps, OtherIncomeTable(), OtherIncomeTableProps, ChangeEmailDialogProps (+20 more)

### Community 75 - "ItemDetailView.tsx"
Cohesion: 0.12
Nodes (15): AllowanceCharge, RemissionBill, RemissionBillingPeriod, RemissionCompany, RemissionCustomer, RemissionDetailResponse, RemissionDian, RemissionEstablishment (+7 more)

### Community 76 - "/graphify Full Pipeline"
Cohesion: 0.29
Nodes (7): graphify Skill Auto-Trigger Rule, /graphify Full Pipeline, Step 1: Ensure graphify is installed, Step 2: Detect files, Step 5: Label communities, Step 6: Generate Obsidian vault + HTML, Step 9: Save manifest, update cost tracker, clean up, report

### Community 77 - "graphify Knowledge Graph System"
Cohesion: 0.29
Nodes (7): GRAPH_REPORT.md, graphify Knowledge Graph System, graphify explain command, graphify path command, graphify query command, graphify update command, graphify-out/wiki/index.md

### Community 78 - "query.md Reference Guide"
Cohesion: 0.52
Nodes (7): graphify explain "NODE_NAME", query.md Reference Guide, graphify path "A" "B", graphify query "<question>", graphify reflect / LESSONS.md, graphify save-result (work memory), Constrained Query Expansion (Step 0)

### Community 79 - "CompanySummaryCard.tsx"
Cohesion: 0.17
Nodes (11): ContactDetailPage(), ContactDetailAttachments(), ContactDetailAttachmentsProps, ContactDetailBranches(), ContactDetailComments(), ContactDetailCommentsProps, ContactDetailGeneral(), ContactDetailHeader() (+3 more)

### Community 80 - "skeleton.tsx"
Cohesion: 0.15
Nodes (12): FilterOption, RETURN_FILTER_OPTIONS, ReturnsFilterChips(), ReturnsFilterChipsProps, ReturnsTable(), ReturnsTableProps, ReturnsTableBody(), ReturnsTableBodyProps (+4 more)

### Community 82 - "tenant.ts"
Cohesion: 0.29
Nodes (6): CreateTenantInput, createTenantSchema, Tenant, tenantSchema, UpdateTenantInput, updateTenantSchema

### Community 83 - "update.md Reference Guide"
Cohesion: 0.33
Nodes (6): build_merge() / graph_diff(), --cluster-only, update.md Reference Guide, --update (incremental re-extraction), Step 4.5: Graph health check, Step 4: Build graph, cluster, analyze, generate outputs

### Community 84 - "widget.interface.ts"
Cohesion: 0.33
Nodes (3): DashboardViewProps, SortableWidgetProps, Widget

### Community 85 - "invoices/page.tsx"
Cohesion: 0.40
Nodes (4): SoftwarePage(), NewSoftwareModal(), SoftwareList(), softwaresApi

### Community 86 - "cotizaciones/page.tsx"
Cohesion: 0.13
Nodes (14): Attribute, Category, Country, CustomField, Department, Municipality, Plan, PriceList (+6 more)

### Community 89 - "github-and-merge.md Reference Guide"
Cohesion: 0.60
Nodes (5): graphify clone <github-url>, github-and-merge.md Reference Guide, graphify merge-graphs, Monorepo / multi-subfolder merge flow, Step 0: GitHub repos and multi-path merge

### Community 90 - "AddGraphMenu.tsx"
Cohesion: 0.40
Nodes (4): AddGraphMenu(), AddGraphMenuProps, allGraphOptions, GraphOption

### Community 93 - "catalogCache.ts"
Cohesion: 0.80
Nodes (4): canUseStorage(), getStorageKey(), readCatalogCache(), writeCatalogCache()

### Community 94 - "hooks.md Reference Guide"
Cohesion: 0.50
Nodes (4): graphify claude install/uninstall (CLAUDE.md integration), graphify hook install/uninstall/status, hooks.md Reference Guide, Commit hook and native CLAUDE.md integration (SKILL.md pointer)

### Community 95 - "transcribe.md Reference Guide"
Cohesion: 0.50
Nodes (4): transcribe.md Reference Guide, Domain-hint Whisper Prompt Strategy, Whisper Video/Audio Transcription (Step 2.5), Step 2.5: Video and audio transcription

### Community 96 - "Next.js Project (create-next-app bootstrap)"
Cohesion: 0.50
Nodes (4): create-next-app CLI, Geist Font (via next/font), Next.js Project (create-next-app bootstrap), Vercel Platform Deployment

### Community 97 - "MonthSelector.tsx"
Cohesion: 0.50
Nodes (3): monthOptions, MonthSelector(), MonthSelectorProps

### Community 98 - "CuentasPorCobrarWidget.tsx"
Cohesion: 0.67
Nodes (3): CuentasPorCobrarData, CuentasPorCobrarWidget(), CuentasPorCobrarWidgetProps

### Community 99 - "CuentasPorPagarWidget.tsx"
Cohesion: 0.67
Nodes (3): CuentasPorPagarData, CuentasPorPagarWidget(), CuentasPorPagarWidgetProps

### Community 103 - "InvoiceDetailPage"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 113 - "EmptyDashboardState.tsx"
Cohesion: 0.31
Nodes (7): ContactDetailGeneralProps, ExportConfig, ExportItemsModal(), ExportItemsModalProps, Label(), RadioGroup(), RadioGroupItem()

### Community 120 - "clsx"
Cohesion: 0.07
Nodes (37): FacturasVentaViewProps, QuotesPage(), FacturasVentaViewProps, QuotesPage(), QuoteFilter(), QuotePageHeader(), QuoteTable(), QuoteTableProps (+29 more)

### Community 122 - "DeleteWidgetDialog.tsx"
Cohesion: 0.28
Nodes (7): FacturasVentaViewProps, InvoicesPage(), InvoicePageHeader(), InvoiceStats, StatCard(), StatCardProps, useInvoicesList()

### Community 182 - "@tabler/icons-react"
Cohesion: 0.22
Nodes (8): TabConfig, InfoChip(), ItemMainInfo(), ItemMainInfoProps, ItemPriceLists(), ItemPriceListsProps, ProductGalleryModal(), ItemResponse

### Community 187 - "providers.tsx"
Cohesion: 0.32
Nodes (4): metadata, CustomToaster(), ThemeProvider(), Providers()

### Community 189 - "certificates/page.tsx"
Cohesion: 0.40
Nodes (4): CertificatesPage(), CertificateList(), NewCertificateModal(), certificatesApi

### Community 192 - "Ajuste de flujo: emisión de facturas y notas crédito ahora es asíncrona"
Cohesion: 0.29
Nodes (6): Ajuste de flujo: emisión de facturas y notas crédito ahora es asíncrona, Contexto, Ejemplo de polling (pseudocódigo, adaptar al stack del frontend), Qué debe hacer el frontend, Qué NO cambia, Qué se rompe con el flujo actual

### Community 196 - "PaymentInvoicesList.tsx"
Cohesion: 0.40
Nodes (5): parseDateSafe(), PaymentInvoicesList(), PaymentInvoicesListProps, WithholdingEntry, PopoverAnchor()

## Knowledge Gaps
- **589 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+584 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **83 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `QuickCreateItemModal.tsx` to `tooltip.tsx`, `Sidebar.tsx`, `NewQuoteSettingsDrawer.tsx`, `invoice/table/columns.tsx`, `sidebar.tsx`, `QuoteTable.tsx`, `useResolutions`, `showToast`, `NewRemissionMain.tsx`, `CreditNotesService`, `ReturnsTableBody.tsx`, `CostCenterTable.tsx`, `PaymentTable.tsx`, `remission.ts`, `contacts/page.tsx`, `invoice.ts`, `cn`, `returns/[id]/page.tsx`, `ResolutionTable.tsx`, `types/catalogs.ts`, `ItemTable.tsx`, `carousel.tsx`, `dependencies`, `InvoiceTable.tsx`, `@tabler/icons-react`, `AuthService`, `ResolutionForm.tsx`, `certificates/page.tsx`, `ExportItemsModal.tsx`, `useCatalogs`, `ItemFilterChips.tsx`, `chart.tsx`, `pagination.tsx`, `skeleton.tsx`, `invoices/page.tsx`, `EmptyDashboardState.tsx`, `clsx`, `DeleteWidgetDialog.tsx`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **Why does `showToast()` connect `pagination.tsx` to `tooltip.tsx`, `dialog.tsx`, `AdvancedOptionsSection.tsx`, `Sidebar.tsx`, `NewQuoteSettingsDrawer.tsx`, `invoice/table/columns.tsx`, `NewReturnForm.backup.tsx`, `QuoteTable.tsx`, `dashboard/page.tsx`, `button.tsx`, `useResolutions`, `showToast`, `NewRemissionMain.tsx`, `CreditNotesService`, `ReturnsTableBody.tsx`, `CostCenterTable.tsx`, `invoices/new/page.tsx`, `PaymentTable.tsx`, `QuoteItemsTable.tsx`, `quote.ts`, `InvoicesService`, `remission.ts`, `invoice.ts`, `NewItemModal.tsx`, `contacts/[id]/page.tsx`, `returns/[id]/page.tsx`, `ResolutionTable.tsx`, `AddContactModal.tsx`, `ItemTable.tsx`, `invoices/[id]/page.tsx`, `invoice/table/FilterChips.tsx`, `remissions/[id]/edit/page.tsx`, `useInvoices.ts`, `QuickCreateItemModal.tsx`, `ExportItemsModal.tsx`, `PaymentDetailTabs.tsx`, `navigation-menu.tsx`, `PaymentInvoicesList.tsx`, `ItemFilterChips.tsx`, `softwares.ts`, `CompanySummaryCard.tsx`, `clsx`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `cn()` connect `ui/utils.ts` to `dialog.tsx`, `NewQuoteSettingsDrawer.tsx`, `invoice/table/columns.tsx`, `cn`, `sidebar.tsx`, `button.tsx`, `useResolutions`, `useQuotes.ts`, `NewItemModal.tsx`, `contacts/[id]/page.tsx`, `context-menu.tsx`, `payments/[id]/page.tsx`, `carousel.tsx`, `ResolutionForm.tsx`, `useCatalogs`, `ExportItemsModal.tsx`, `drawer.tsx`, `chart.tsx`, `pagination.tsx`, `softwares.ts`, `package.json`, `InvoiceDetailPage`, `EmptyDashboardState.tsx`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _589 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `tooltip.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12895927601809956 - nodes in this community are weakly interconnected._
- **Should `dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07472613458528951 - nodes in this community are weakly interconnected._
- **Should `AdvancedOptionsSection.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10952380952380952 - nodes in this community are weakly interconnected._