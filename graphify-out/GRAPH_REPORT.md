# Graph Report - facturacion-cliente  (2026-08-11)

## Corpus Check
- 500 files · ~271,316 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2261 nodes · 6722 edges · 197 communities (128 shown, 69 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `245d2850`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NewReturnForm.tsx
- tooltip.tsx
- dialog.tsx
- types/auth.ts
- types/catalogs.ts
- NewRemissionMain.tsx
- quote/table/columns.tsx
- NewQuoteSettingsDrawer.tsx
- sidebar.tsx
- useRemissions.ts
- quote.ts
- ApiResponse
- dashboard/page.tsx
- AuthService
- button.tsx
- devDependencies
- remissions/page.tsx
- compilerOptions
- items/[id]/page.tsx
- types/items.ts
- QuickCreateItemModal.tsx
- components.json
- returns/[id]/page.tsx
- useDebounce
- CostCenterFilter.tsx
- searchable-select.tsx
- lib/items.ts
- ui/utils.ts
- PaymentFilterChips.tsx
- showToast
- QuoteItemsTable.tsx
- InvoicesService
- useQuotes.ts
- invoices/[id]/page.tsx
- RemissionTable.tsx
- contacts/page.tsx
- ItemResponse
- invoice.ts
- ItemDetailView.tsx
- activate-account/page.tsx
- IntegrationsService
- formatCurrency
- useCatalogs
- cn
- payments/[id]/page.tsx
- ContactAdvancedForm.tsx
- useInvoices.ts
- tasks/page.tsx
- ItemTable.tsx
- WidgetSkeleton.tsx
- useCompanyProfile.ts
- carousel.tsx
- dependencies
- InvoiceTable.tsx
- quotes/[id]/edit/page.tsx
- ItemDocumentsTab.tsx
- form.tsx
- Extraction Subagent Prompt Template
- CalculationService (Backend)
- NewReturnForm
- remission.ts
- Sidebar.tsx
- cn
- auth-context.tsx
- drawer.tsx
- invoices/page.tsx
- exports.md Reference Guide
- ReportsSections.tsx
- PersonalDataSection.tsx
- remissions/new/page.tsx
- chart.tsx
- TwoFactorPanel.tsx
- --update / --cluster-only subcommands (SKILL.md pointer)
- contacts/[id]/page.tsx
- input.tsx
- useRevokeDevice
- /graphify Full Pipeline
- graphify Knowledge Graph System
- query.md Reference Guide
- PaymentDetailTabs.tsx
- ReturnsTableBody.tsx
- EmptyDashboardState.tsx
- tenant.ts
- update.md Reference Guide
- widget.interface.ts
- softwares.ts
- CompanySummaryCard.tsx
- checkbox.tsx
- package.json
- github-and-merge.md Reference Guide
- AddGraphMenu.tsx
- CommentsAndReminders.tsx
- api-client.ts
- catalogCache.ts
- hooks.md Reference Guide
- transcribe.md Reference Guide
- Next.js Project (create-next-app bootstrap)
- MonthSelector.tsx
- CuentasPorCobrarWidget.tsx
- CuentasPorPagarWidget.tsx
- DeleteWidgetDialog.tsx
- invoice/InvoiceItemsTable.tsx
- context-menu.tsx
- ImpuestosWidget.tsx
- next.config.ts
- contacts/layout.tsx
- dashboard/layout.tsx
- invoices/layout.tsx
- invoices/new/layout.tsx
- items/layout.tsx
- payments/new/layout.tsx
- NewQuoteMain.tsx
- EmptyStateWidget.tsx
- dayjs
- DocumentTitleUpdater.tsx
- Loader.tsx
- proxy.ts
- axios
- QuoteTable.tsx
- extractErrorMessage
- geist
- @dnd-kit/core
- @dnd-kit/modifiers
- @dnd-kit/sortable
- @dnd-kit/utilities
- embla-carousel-react
- eslint.config.mjs
- next-themes
- @hookform/resolvers
- html2canvas
- input-otp
- @radix-ui/react-slot
- next
- react-hook-form
- radix-ui
- @radix-ui/react-accordion
- quotes/[id]/page.tsx
- @radix-ui/react-checkbox
- @radix-ui/react-dialog
- dropdown-menu.tsx
- @radix-ui/react-label
- @radix-ui/react-progress
- CustomToaster.tsx
- ApiClient
- InvoiceFilter.tsx
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
- navigation-menu.tsx
- tailwind-merge
- tailwindcss-animate
- @tanstack/query-sync-storage-persister
- api.ts
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
- cotizaciones/page.tsx
- invoices/new/page.tsx
- remission/table/columns.tsx
- QuoteSummary
- pagination.tsx
- NewPaymentForm.tsx
- certificates/page.tsx
- ItemFilterChips.tsx
- PasswordGateDialog
- ClientesConVentasWidget.tsx
- attributes.ts
- class-variance-authority
- QuoteFindAllSuccess
- RemissionFindAllSuccess

## God Nodes (most connected - your core abstractions)
1. `cn()` - 198 edges
2. `showToast()` - 192 edges
3. `cn()` - 139 edges
4. `react` - 114 edges
5. `Button()` - 101 edges
6. `DialogContent()` - 51 edges
7. `DialogTitle()` - 51 edges
8. `Dialog()` - 50 edges
9. `useCatalogs()` - 49 edges
10. `ApiResponse` - 49 edges

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

## Communities (197 total, 69 thin omitted)

### Community 0 - "NewReturnForm.tsx"
Cohesion: 0.06
Nodes (61): PaymentsPage(), CertificateListProps, ContactTableBodyProps, CostCenterTable(), CostCenterTableProps, ServerPagination, CostCenter, getColumns() (+53 more)

### Community 1 - "tooltip.tsx"
Cohesion: 0.13
Nodes (16): FlujoTransaccionesData, FlujoTransaccionesWidgetProps, ProductoItem, ProductosMasVendidosWidgetProps, TotalVentasWidgetProps, VentasData, InvoiceDianStatusProps, GeneralInfoSectionProps (+8 more)

### Community 2 - "dialog.tsx"
Cohesion: 0.11
Nodes (25): NewCertificateModalProps, ConfigCostCentersModal(), ConfigCostCentersModalProps, DOCUMENT_TYPES, CreateCurrencyModalProps, ProductGalleryModalProps, CreateWarehouseModalProps, ProductComboModalProps (+17 more)

### Community 3 - "types/auth.ts"
Cohesion: 0.10
Nodes (25): ChangeEmailDialog(), TwoFactorPanel(), useChangeEmail(), useDevices(), useConfirmTwoFactor(), useDisableTwoFactor(), useEnableTwoFactor(), useRegenerateRecoveryCodes() (+17 more)

### Community 4 - "types/catalogs.ts"
Cohesion: 0.12
Nodes (15): Attribute, Category, Country, CustomField, Department, Municipality, Plan, PriceList (+7 more)

### Community 5 - "NewRemissionMain.tsx"
Cohesion: 0.23
Nodes (16): ContactAccountingInfoProps, ContactCommercialInfoProps, NewPaymentTermModal(), QuoteExportModal(), QuoteExportModalProps, RemissionExportModal(), RemissionExportModalProps, ResolutionFilterChipsProps (+8 more)

### Community 6 - "quote/table/columns.tsx"
Cohesion: 0.16
Nodes (18): NewCertificateFormProps, InvoiceDetailHeaderProps, NewSoftwareFormProps, AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription() (+10 more)

### Community 7 - "NewQuoteSettingsDrawer.tsx"
Cohesion: 0.20
Nodes (13): NewCurrencyModal(), NewPriceListModal(), NewPriceListModalProps, FixedFields, FixedFields, NewSellerModal(), CreateWarehouseModalProps, NewWarehouseModal() (+5 more)

### Community 8 - "sidebar.tsx"
Cohesion: 0.08
Nodes (28): Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+20 more)

### Community 9 - "useRemissions.ts"
Cohesion: 0.17
Nodes (12): RemissionDetailPage(), NewRemissionPage(), REMISSION_KEY(), REMISSIONS_KEY, useCreateRemission(), useDeleteRemission(), usePrefetchRemissionDetail(), useRemission() (+4 more)

### Community 10 - "quote.ts"
Cohesion: 0.12
Nodes (16): AllowanceCharge, QuoteBill, QuoteBillingPeriod, QuoteCompany, QuoteCustomer, QuoteDetailResponse, QuoteDian, QuoteEstablishment (+8 more)

### Community 11 - "ApiResponse"
Cohesion: 0.19
Nodes (3): PaymentTermsService, SellersService, ApiResponse

### Community 12 - "dashboard/page.tsx"
Cohesion: 0.11
Nodes (23): DashboardPage(), isPredefinedWidget(), PREDEFINED_POSITIONS, SortableWidgetProps, Widget, DevolucionesWidget(), DevolucionesWidgetProps, FlujoTransaccionesWidget() (+15 more)

### Community 13 - "AuthService"
Cohesion: 0.17
Nodes (7): AccountSwitcher(), AccountSwitcherProps, HelpCenterPopover(), HelpCenterPopoverProps, NewPaymentForm(), AuthService, AuthBootstrap()

### Community 14 - "button.tsx"
Cohesion: 0.14
Nodes (15): FormState, InvoicePageHeaderProps, StatusToggle(), ExportConfig, PaymentDetailHeaderProps, QuoteDetailHeaderProps, QuotePageHeaderProps, RemissionPageHeaderProps (+7 more)

### Community 15 - "devDependencies"
Cohesion: 0.09
Nodes (23): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, shadcn (+15 more)

### Community 16 - "remissions/page.tsx"
Cohesion: 0.40
Nodes (4): FacturasVentaViewProps, RemissionsPage(), RemissionPageHeader(), useRemissionsList()

### Community 17 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 18 - "items/[id]/page.tsx"
Cohesion: 0.16
Nodes (10): ItemDetailPage(), ItemsPage(), ItemAccounting(), ItemAttachments(), ItemHeader(), ItemInventory(), ItemInventoryProps, useDeleteItem() (+2 more)

### Community 19 - "types/items.ts"
Cohesion: 0.08
Nodes (30): Image, BaseItemBasicInfo, BaseItemPayload, ComboBasicInfo, ComboItemPayload, CreateItemAccounting, CreateItemComboComponent, CreateItemComboSettings (+22 more)

### Community 20 - "QuickCreateItemModal.tsx"
Cohesion: 0.09
Nodes (34): NewItemPage(), CategoryModalProps, NewCategoryModal(), CustomFieldModal(), BLANK_BASIC, QuickCreateItemModal(), QuickCreateItemModalProps, AccountingSection() (+26 more)

### Community 21 - "components.json"
Cohesion: 0.08
Nodes (23): aliases, components, hooks, lib, ui, utils, Authorization, iconLibrary (+15 more)

### Community 22 - "returns/[id]/page.tsx"
Cohesion: 0.15
Nodes (10): ReturnDetailPage(), ReturnDetailDocument(), ReturnDetailHeader(), ReturnDetailSkeleton(), CREDIT_NOTE_KEY(), CREDIT_NOTES_KEY, useCreditNote(), useSendCreditNote() (+2 more)

### Community 23 - "useDebounce"
Cohesion: 0.17
Nodes (11): ReturnsPage(), FilterOption, paymentFilterOptions, PaymentTableToolbar(), PaymentTableToolbarProps, ReturnPageHeader(), ReturnsTable(), DebouncedInput() (+3 more)

### Community 24 - "CostCenterFilter.tsx"
Cohesion: 0.29
Nodes (6): CostCenterFilterProps, defaultCostCenterFilterOptions, FilterOption, FilterChipsProps, filterIcons, filterLabels

### Community 25 - "searchable-select.tsx"
Cohesion: 0.13
Nodes (25): CustomFieldModalProps, FALLBACK_FIELD_TYPES, AsyncSearchableSelectOption, AsyncSearchableSelectProps, Calendar(), CalendarDayButton(), Command(), CommandDialog() (+17 more)

### Community 26 - "lib/items.ts"
Cohesion: 0.20
Nodes (10): EditItemPage(), UseItemsParams, useItemById(), useUpdateItem(), itemsApi, PaginatedData, GetItemByIdResponse, ItemsListApiData (+2 more)

### Community 27 - "ui/utils.ts"
Cohesion: 0.11
Nodes (13): ContactDetailGeneral(), ContactDetailGeneralProps, HoverCardContent(), RadioGroup(), RadioGroupItem(), ResizableHandle(), ResizablePanelGroup(), Slider() (+5 more)

### Community 28 - "PaymentFilterChips.tsx"
Cohesion: 0.40
Nodes (4): filterLabels, MOCK_BANK_ACCOUNTS, PAYMENT_STATUSES, paymentFilterOptions

### Community 29 - "showToast"
Cohesion: 0.07
Nodes (29): react, react, CostCentersPage(), NewPaymentPage(), NewCertificateForm(), CostCenter, NewCostCenterModal(), NewCostCenterModalProps (+21 more)

### Community 30 - "QuoteItemsTable.tsx"
Cohesion: 0.16
Nodes (22): InvoiceItemsTable(), ItemRow(), InvoiceItem, NewInvoiceViewProps, ItemRow(), QuoteItemsTable(), ItemRow(), RemissionItemsTable() (+14 more)

### Community 31 - "InvoicesService"
Cohesion: 0.18
Nodes (4): InvoiceDetailPage(), useSendInvoice(), InvoicesService, Invoice

### Community 32 - "useQuotes.ts"
Cohesion: 0.19
Nodes (11): QuoteDetailPage(), NewQuotePage(), INVOICE_KEY(), INVOICES_KEY, useCreateQuote(), usePrefetchQuoteDetail(), useQuote(), useSendQuote() (+3 more)

### Community 33 - "invoices/[id]/page.tsx"
Cohesion: 0.17
Nodes (8): InvoiceDetailDocument(), InvoiceDetailExtraInfo(), InvoiceDetailExtraInfoProps, InvoiceDetailSkeleton(), InvoiceDetailSummary(), InvoiceDetailSummaryProps, InvoiceDetailTabs(), InvoiceDianStatus()

### Community 34 - "RemissionTable.tsx"
Cohesion: 0.14
Nodes (16): RemissionFilter(), RemissionTable(), RemissionTableProps, ServerPagination, getColumns(), FilterChips(), FilterChipsProps, filterValueToColumnId (+8 more)

### Community 35 - "contacts/page.tsx"
Cohesion: 0.11
Nodes (22): Contact, ContactPage(), ContactType, Contact, ContactTable(), ContactTableProps, SelectionState, ServerPagination (+14 more)

### Community 36 - "ItemResponse"
Cohesion: 0.18
Nodes (10): TabConfig, ItemHeaderProps, InfoChip(), ItemMainInfo(), ItemMainInfoProps, ItemPriceLists(), ItemPriceListsProps, ProductGalleryModal() (+2 more)

### Community 37 - "invoice.ts"
Cohesion: 0.14
Nodes (13): AllowanceCharge, InvoiceBill, InvoiceBillingPeriod, InvoiceCompany, InvoiceCustomer, InvoiceDian, InvoiceEstablishment, InvoiceFindAllEmpty (+5 more)

### Community 38 - "ItemDetailView.tsx"
Cohesion: 0.32
Nodes (7): formatMoney(), getItemTypeName(), InfoChip(), InfoField(), ItemDetailView(), StatusToggle(), TabButton()

### Community 39 - "activate-account/page.tsx"
Cohesion: 0.16
Nodes (15): ConfirmEmailPage(), AuthLinkStatus(), AuthLinkStatusProps, PasswordResetForm(), InvoiceStats, StatCard(), StatCardProps, LogoHorizontal() (+7 more)

### Community 40 - "IntegrationsService"
Cohesion: 0.10
Nodes (19): ApiKeysTab(), CreateApiKeyModal(), CreateApiKeyModalProps, CreateWebhookModal(), CreateWebhookModalProps, RotateSecretModal(), RotateSecretModalProps, WebhookDeliveriesModal() (+11 more)

### Community 41 - "formatCurrency"
Cohesion: 0.21
Nodes (10): PaymentDetailAccountingAccounts(), PaymentDetailAccountingAccountsProps, PaymentDetailTotal(), PaymentDetailTotalProps, ReturnDetailSummary(), ReturnDetailSummaryProps, ReturnDetailTabs(), ReturnDetailTabsProps (+2 more)

### Community 42 - "useCatalogs"
Cohesion: 0.11
Nodes (26): EditResolutionPage(), NewResolutionPage(), ResolutionsPage(), EditResolutionModalProps, NewInvoicePayment(), baseSchema, formSchema, ResolutionForm() (+18 more)

### Community 43 - "cn"
Cohesion: 0.05
Nodes (43): AccordionContent(), AccordionItem(), AccordionTrigger(), Alert(), AlertDescription(), AlertTitle(), alertVariants, Avatar() (+35 more)

### Community 44 - "payments/[id]/page.tsx"
Cohesion: 0.14
Nodes (11): PaymentDetailPage(), Attachment, PaymentDetailAttachments(), PaymentDetailAttachmentsProps, PaymentDetailHeader(), PaymentDetailInfo(), PaymentDetailInfoProps, PaymentDetailTabs() (+3 more)

### Community 45 - "ContactAdvancedForm.tsx"
Cohesion: 0.13
Nodes (23): EditContactContent(), NewContactContent(), AddContactModalProps, ModalContent(), PrefilledContactData, ContactAccountingInfo(), ContactAdvancedForm(), ContactAdvancedFormProps (+15 more)

### Community 46 - "useInvoices.ts"
Cohesion: 0.23
Nodes (9): InvoiceEditPage(), INVOICE_KEY(), INVOICES_KEY, useInvoice(), usePrefetchInvoiceDetail(), useUpdateInvoice(), InvoiceDetailResponse, InvoiceFindAllSuccess (+1 more)

### Community 47 - "tasks/page.tsx"
Cohesion: 0.16
Nodes (10): NewTaskDrawer(), NewTaskDrawerProps, ASSIGNEE_OPTIONS, FILTER_TABS, PRIORITY_OPTIONS, STATUS_OPTIONS, TaskFiltersPopup(), TaskFiltersPopupProps (+2 more)

### Community 48 - "ItemTable.tsx"
Cohesion: 0.13
Nodes (16): ItemTable(), ItemTableProps, SelectionState, ServerPagination, getItemColumns(), ItemFilterChipsProps, ItemTableBody(), ItemTableBodyProps (+8 more)

### Community 50 - "useCompanyProfile.ts"
Cohesion: 0.33
Nodes (6): CompanyProfileForm(), getInitials(), useUpdateCompanyProfile(), CompanyProfileService, CompanyProfileUpdatePayload, CompanyProfileUpdateResponse

### Community 51 - "carousel.tsx"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 52 - "dependencies"
Cohesion: 0.07
Nodes (27): clsx, cmdk, date-fns, jspdf, lucide-react, dependencies, clsx, cmdk (+19 more)

### Community 53 - "InvoiceTable.tsx"
Cohesion: 0.13
Nodes (17): InvoiceTable(), InvoiceTableProps, ServerPagination, getColumns(), FilterChips(), FilterChipsProps, filterValueToColumnId, InvoiceTableBody() (+9 more)

### Community 54 - "quotes/[id]/edit/page.tsx"
Cohesion: 0.17
Nodes (18): EditQuotePage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), NewQuoteFooter(), NewQuoteHeader(), NewQuoteHeaderProps, NewQuoteOptions(), NewQuoteSettingsDrawer() (+10 more)

### Community 55 - "ItemDocumentsTab.tsx"
Cohesion: 0.32
Nodes (11): formatMoney(), getClientName(), getDocDate(), getDocNumber(), getDocStatus(), getDocTotal(), ItemDocumentsTab(), resolveDoc() (+3 more)

### Community 56 - "form.tsx"
Cohesion: 0.23
Nodes (11): FormControl(), FormDescription(), FormField(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue (+3 more)

### Community 57 - "Extraction Subagent Prompt Template"
Cohesion: 0.18
Nodes (11): Confidence Score Rubric (EXTRACTED/INFERRED/AMBIGUOUS), extraction-spec.md Reference Guide, Hyperedge Extraction Rule, Node ID Format Spec ({stem}_{entity}), semantically_similar_to Edge Rule, Extraction Subagent Prompt Template, Honesty Rules, Part A: Structural (AST) extraction (+3 more)

### Community 58 - "CalculationService (Backend)"
Cohesion: 0.42
Nodes (11): CalculationService (Backend), Rationale: Frontend Must Not Send Monetary Amounts, credit_note_reference_index field, POST /api/credit-notes endpoint, POST /api/credit-notes/send endpoint, Tipo 1: Devolución Parcial (Ajuste de Cantidad), Tipo 2: Anulación Completa de la Factura, Tipo 3 y 6: Rebaja / Descuento a Líneas (+3 more)

### Community 59 - "NewReturnForm"
Cohesion: 0.32
Nodes (3): NewReturnForm(), createEmptyLine(), NewReturnForm()

### Community 60 - "remission.ts"
Cohesion: 0.13
Nodes (14): AllowanceCharge, RemissionBill, RemissionBillingPeriod, RemissionCompany, RemissionCustomer, RemissionDian, RemissionEstablishment, RemissionFindAllEmpty (+6 more)

### Community 61 - "Sidebar.tsx"
Cohesion: 0.20
Nodes (11): AuthenticatedLayout(), Header(), Logo(), CollapseButton(), MenuItem(), MenuItemProps, Sidebar(), SidebarMenuItem (+3 more)

### Community 62 - "cn"
Cohesion: 0.12
Nodes (26): ItemImage, AttributeModal(), AttributeModalProps, AdvancedOptionsSection(), ComboProductEntry, PriceListEntry, WarehouseEntry, ImageUploader() (+18 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.13
Nodes (15): CompanyProfilePage(), LoginPage(), RootPage(), SplashScreen(), SplashScreenProps, UserMenu(), UserMenuProps, AuthContext (+7 more)

### Community 64 - "drawer.tsx"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 65 - "invoices/page.tsx"
Cohesion: 0.50
Nodes (4): FacturasVentaViewProps, InvoicesPage(), InvoicePageHeader(), useInvoicesList()

### Community 66 - "exports.md Reference Guide"
Cohesion: 0.22
Nodes (9): Token reduction benchmark (Step 8), --falkordb / --falkordb-push export (Step 7a), --graphml export (Step 7c), exports.md Reference Guide, --mcp MCP stdio server (Step 7d), --neo4j / --neo4j-push export (Step 7), --svg export (Step 7b), --wiki export (Step 6b) (+1 more)

### Community 67 - "ReportsSections.tsx"
Cohesion: 0.33
Nodes (5): CategoryCard(), CategoryCardProps, ReportsCategoryGrid(), ReportsHeader(), ReportsSearchBar()

### Community 68 - "PersonalDataSection.tsx"
Cohesion: 0.24
Nodes (11): SecurityPage(), getInitials(), isTenantProfile(), PersonalDataSection(), TwoFactorSection(), Skeleton(), useProfile(), useTwoFactorStatus() (+3 more)

### Community 69 - "remissions/new/page.tsx"
Cohesion: 0.15
Nodes (19): EditRemissionPage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), PreviewModal(), PreviewModalProps, NewRemissionFooter(), NewRemissionHeader(), NewRemissionHeaderProps (+11 more)

### Community 70 - "chart.tsx"
Cohesion: 0.16
Nodes (15): DistribucionGastosWidget(), DistribucionGastosWidgetProps, GastoItem, ClienteItem, MejoresClientesWidget(), MejoresClientesWidgetProps, ChartConfig, ChartContainer() (+7 more)

### Community 71 - "TwoFactorPanel.tsx"
Cohesion: 0.09
Nodes (19): RecoveryCodesDisplay(), RecoveryCodesDisplayProps, CodeMode, ENABLE_STEP_PROGRESS, OTP_SLOTS, Step, TwoFactorPanelProps, InputOTP() (+11 more)

### Community 72 - "--update / --cluster-only subcommands (SKILL.md pointer)"
Cohesion: 0.29
Nodes (7): /graphify add <url>, add-watch.md Reference Guide, --watch (background folder watcher), /graphify add and --watch flow (SKILL.md pointer), Interpreter guard for subcommands, /graphify query flow (SKILL.md pointer), --update / --cluster-only subcommands (SKILL.md pointer)

### Community 73 - "contacts/[id]/page.tsx"
Cohesion: 0.15
Nodes (12): ContactDetailPage(), ContactDetailAttachments(), ContactDetailAttachmentsProps, ContactDetailBranches(), ContactDetailBranchesProps, ContactDetailComments(), ContactDetailCommentsProps, ContactDetailHeader() (+4 more)

### Community 74 - "input.tsx"
Cohesion: 0.17
Nodes (18): PasswordResetFormProps, TwoFactorChallengeForm(), TwoFactorChallengeFormProps, ChangeEmailDialogProps, PasswordGateDialogProps, Field(), FieldContent(), FieldDescription() (+10 more)

### Community 75 - "useRevokeDevice"
Cohesion: 0.50
Nodes (3): ConnectedDevicesSection(), formatRelativeTime(), useRevokeDevice()

### Community 76 - "/graphify Full Pipeline"
Cohesion: 0.29
Nodes (7): graphify Skill Auto-Trigger Rule, /graphify Full Pipeline, Step 1: Ensure graphify is installed, Step 2: Detect files, Step 5: Label communities, Step 6: Generate Obsidian vault + HTML, Step 9: Save manifest, update cost tracker, clean up, report

### Community 77 - "graphify Knowledge Graph System"
Cohesion: 0.29
Nodes (7): GRAPH_REPORT.md, graphify Knowledge Graph System, graphify explain command, graphify path command, graphify query command, graphify update command, graphify-out/wiki/index.md

### Community 78 - "query.md Reference Guide"
Cohesion: 0.52
Nodes (7): graphify explain "NODE_NAME", query.md Reference Guide, graphify path "A" "B", graphify query "<question>", graphify reflect / LESSONS.md, graphify save-result (work memory), Constrained Query Expansion (Step 0)

### Community 79 - "PaymentDetailTabs.tsx"
Cohesion: 0.47
Nodes (3): PaymentDetailAccounting(), PaymentDetailAdvances(), PaymentDetailTabsProps

### Community 80 - "ReturnsTableBody.tsx"
Cohesion: 0.16
Nodes (11): FilterOption, RETURN_FILTER_OPTIONS, ReturnsFilterChips(), ReturnsFilterChipsProps, ReturnsTableProps, ReturnsTableBody(), ReturnsTableBodyProps, ReturnsTablePagination() (+3 more)

### Community 82 - "tenant.ts"
Cohesion: 0.29
Nodes (6): CreateTenantInput, createTenantSchema, Tenant, tenantSchema, UpdateTenantInput, updateTenantSchema

### Community 83 - "update.md Reference Guide"
Cohesion: 0.33
Nodes (6): build_merge() / graph_diff(), --cluster-only, update.md Reference Guide, --update (incremental re-extraction), Step 4.5: Graph health check, Step 4: Build graph, cluster, analyze, generate outputs

### Community 84 - "widget.interface.ts"
Cohesion: 0.33
Nodes (3): DashboardViewProps, SortableWidgetProps, Widget

### Community 85 - "softwares.ts"
Cohesion: 0.29
Nodes (6): SoftwarePage(), NewSoftwareModal(), SoftwareList(), CreateSoftwarePayload, SoftwareResponse, softwaresApi

### Community 86 - "CompanySummaryCard.tsx"
Cohesion: 0.31
Nodes (5): CompanySummaryCard(), ConfigCard(), ConfigCardProps, ConfigLink, ConfigurationGrid()

### Community 87 - "checkbox.tsx"
Cohesion: 0.13
Nodes (14): filterIcons, filterLabels, defaultFilterOptions, FilterOption, QuoteFilterProps, filterIcons, filterLabels, defaultFilterOptions (+6 more)

### Community 88 - "package.json"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 89 - "github-and-merge.md Reference Guide"
Cohesion: 0.60
Nodes (5): graphify clone <github-url>, github-and-merge.md Reference Guide, graphify merge-graphs, Monorepo / multi-subfolder merge flow, Step 0: GitHub repos and multi-path merge

### Community 90 - "AddGraphMenu.tsx"
Cohesion: 0.40
Nodes (4): AddGraphMenu(), AddGraphMenuProps, allGraphOptions, GraphOption

### Community 91 - "CommentsAndReminders.tsx"
Cohesion: 0.16
Nodes (9): PaymentTabs(), RemissionDetailDocument(), RemissionDetailExtraInfo(), RemissionDetailExtraInfoProps, RemissionDetailSkeleton(), RemissionDetailSummary(), RemissionDetailSummaryProps, CommentsAndReminders() (+1 more)

### Community 92 - "api-client.ts"
Cohesion: 0.23
Nodes (7): DOCUMENT_TYPES, DocumentType, envs, DateRangeExportResult, exportByDateRange(), extractFilenameFromContentDisposition(), extractJsonMessage()

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

### Community 103 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 113 - "NewQuoteMain.tsx"
Cohesion: 0.27
Nodes (10): Factucore Horizontal Logo, getSession(), SessionData, FactucoreLogo(), FactucoreLogoProps, EditResolutionModal(), NewInvoiceMain(), NewQuoteMain() (+2 more)

### Community 120 - "QuoteTable.tsx"
Cohesion: 0.21
Nodes (10): QuoteTable(), ServerPagination, getColumns(), FilterChips(), filterValueToColumnId, QuoteTableBody(), QuoteTablePagination(), QuoteTablePaginationProps (+2 more)

### Community 121 - "extractErrorMessage"
Cohesion: 0.30
Nodes (7): ActivateAccountPage(), ResetPasswordPage(), ChangePasswordDialog(), ChangePasswordDialogProps, useChangePassword(), extractErrorMessage(), ResetPasswordPayload

### Community 138 - "quotes/[id]/page.tsx"
Cohesion: 0.21
Nodes (7): QuoteDetailDocument(), QuoteDetailExtraInfo(), QuoteDetailExtraInfoProps, QuoteDetailHeader(), QuoteDetailSkeleton(), QuoteDetailSummary(), QuoteDetailSummaryProps

### Community 141 - "dropdown-menu.tsx"
Cohesion: 0.22
Nodes (7): HeaderProps, SolutionsPopover(), SolutionsPopoverProps, DropdownMenuSeparator(), DropdownMenuSub(), DropdownMenuSubContent(), DropdownMenuSubTrigger()

### Community 144 - "CustomToaster.tsx"
Cohesion: 0.22
Nodes (7): metadata, CustomToaster(), CustomToastProps, ToastIcon(), ToastType, ThemeProvider(), Providers()

### Community 146 - "InvoiceFilter.tsx"
Cohesion: 0.22
Nodes (8): contactFilterOptions, ContactTableToolbar(), ContactTableToolbarProps, FilterOption, defaultFilterOptions, FilterOption, InvoiceFilter(), InvoiceFilterProps

### Community 157 - "navigation-menu.tsx"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 161 - "api.ts"
Cohesion: 0.20
Nodes (4): CONTACTS_KEY, categoriesApi, currenciesApi, priceListsApi

### Community 182 - "cotizaciones/page.tsx"
Cohesion: 0.31
Nodes (6): FacturasVentaViewProps, QuotesPage(), FacturasVentaViewProps, QuotesPage(), QuotePageHeader(), useQuotesList()

### Community 183 - "invoices/new/page.tsx"
Cohesion: 0.31
Nodes (6): NewInvoicePage(), NewInvoiceFooter(), NewInvoiceHeader(), NewInvoiceHeaderProps, useInvoiceBuilder(), useCreateInvoice()

### Community 184 - "remission/table/columns.tsx"
Cohesion: 0.33
Nodes (5): RemissionDetailHeader(), RemissionDetailHeaderProps, ActionsCell(), isRemissionInvoiced(), StatusBadge()

### Community 185 - "QuoteSummary"
Cohesion: 0.29
Nodes (7): QuoteFilter(), QuoteTableProps, FilterChipsProps, QuoteTableBodyProps, QuoteTableToolbar(), QuoteTableToolbarProps, QuoteSummary

### Community 187 - "pagination.tsx"
Cohesion: 0.25
Nodes (6): Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLinkProps, PaginationNext(), PaginationPrevious()

### Community 188 - "NewPaymentForm.tsx"
Cohesion: 0.33
Nodes (5): AddContactModal(), NewPaymentFormProps, OtherIncomeTable(), OtherIncomeTableProps, PaymentNumberingModal()

### Community 189 - "certificates/page.tsx"
Cohesion: 0.40
Nodes (4): CertificatesPage(), CertificateList(), NewCertificateModal(), certificatesApi

### Community 190 - "ItemFilterChips.tsx"
Cohesion: 0.40
Nodes (4): filterLabels, ItemFilterChips(), itemFilterOptions, MOCK_WAREHOUSES

## Knowledge Gaps
- **561 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+556 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **69 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `showToast` to `NewReturnForm.tsx`, `tooltip.tsx`, `dialog.tsx`, `NewRemissionMain.tsx`, `NewQuoteSettingsDrawer.tsx`, `sidebar.tsx`, `dashboard/page.tsx`, `remissions/page.tsx`, `items/[id]/page.tsx`, `QuickCreateItemModal.tsx`, `useDebounce`, `searchable-select.tsx`, `ui/utils.ts`, `QuoteItemsTable.tsx`, `RemissionTable.tsx`, `contacts/page.tsx`, `ItemResponse`, `ItemDetailView.tsx`, `useCatalogs`, `payments/[id]/page.tsx`, `ItemTable.tsx`, `carousel.tsx`, `dependencies`, `InvoiceTable.tsx`, `cotizaciones/page.tsx`, `ItemDocumentsTab.tsx`, `remission/table/columns.tsx`, `form.tsx`, `certificates/page.tsx`, `cn`, `ItemFilterChips.tsx`, `Sidebar.tsx`, `invoices/page.tsx`, `remissions/new/page.tsx`, `chart.tsx`, `TwoFactorPanel.tsx`, `ReturnsTableBody.tsx`, `softwares.ts`, `checkbox.tsx`, `CommentsAndReminders.tsx`, `QuoteTable.tsx`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `showToast()` connect `showToast` to `NewReturnForm.tsx`, `tooltip.tsx`, `dialog.tsx`, `types/auth.ts`, `NewRemissionMain.tsx`, `quote/table/columns.tsx`, `NewQuoteSettingsDrawer.tsx`, `useRemissions.ts`, `quotes/[id]/page.tsx`, `dashboard/page.tsx`, `button.tsx`, `remissions/page.tsx`, `CustomToaster.tsx`, `items/[id]/page.tsx`, `QuickCreateItemModal.tsx`, `returns/[id]/page.tsx`, `searchable-select.tsx`, `lib/items.ts`, `QuoteItemsTable.tsx`, `InvoicesService`, `useQuotes.ts`, `invoices/[id]/page.tsx`, `activate-account/page.tsx`, `IntegrationsService`, `useCatalogs`, `ContactAdvancedForm.tsx`, `useCompanyProfile.ts`, `quotes/[id]/edit/page.tsx`, `invoices/new/page.tsx`, `cotizaciones/page.tsx`, `remission/table/columns.tsx`, `NewReturnForm`, `Sidebar.tsx`, `cn`, `PasswordGateDialog`, `auth-context.tsx`, `PersonalDataSection.tsx`, `remissions/new/page.tsx`, `TwoFactorPanel.tsx`, `contacts/[id]/page.tsx`, `input.tsx`, `useRevokeDevice`, `CommentsAndReminders.tsx`, `NewQuoteMain.tsx`, `extractErrorMessage`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `dialog.tsx`, `NewRemissionMain.tsx`, `quote/table/columns.tsx`, `sidebar.tsx`, `dropdown-menu.tsx`, `button.tsx`, `searchable-select.tsx`, `ui/utils.ts`, `navigation-menu.tsx`, `activate-account/page.tsx`, `IntegrationsService`, `carousel.tsx`, `form.tsx`, `pagination.tsx`, `drawer.tsx`, `chart.tsx`, `TwoFactorPanel.tsx`, `input.tsx`, `checkbox.tsx`, `context-menu.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _561 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `NewReturnForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05690834473324213 - nodes in this community are weakly interconnected._
- **Should `tooltip.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12941176470588237 - nodes in this community are weakly interconnected._
- **Should `dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10784313725490197 - nodes in this community are weakly interconnected._