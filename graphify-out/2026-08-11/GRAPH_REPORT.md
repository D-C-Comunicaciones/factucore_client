# Graph Report - facturacion-cliente  (2026-08-11)

## Corpus Check
- 500 files · ~271,009 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2259 nodes · 6715 edges · 176 communities (111 shown, 65 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `245d2850`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PaymentInvoicesList.tsx
- tooltip.tsx
- dialog.tsx
- types/auth.ts
- types/catalogs.ts
- NewRemissionMain.tsx
- CustomToaster.tsx
- menubar.tsx
- sidebar.tsx
- remissions/[id]/edit/page.tsx
- quote.ts
- ApiResponse
- dashboard/page.tsx
- AuthService
- button.tsx
- devDependencies
- showToast
- compilerOptions
- items/page.tsx
- types/items.ts
- QuickCreateItemModal.tsx
- components.json
- returns/[id]/page.tsx
- useDebounce
- CostCenterTable.tsx
- lib/utils.ts
- lib/items.ts
- ui/utils.ts
- PaymentTable.tsx
- react
- resolveStockFields
- InvoicesService
- useQuotes.ts
- invoices/[id]/page.tsx
- RemissionTable.tsx
- ContactTable.tsx
- items/[id]/page.tsx
- invoice.ts
- cn
- errors.ts
- IntegrationsService
- formatCurrency
- ResolutionTable.tsx
- cn
- payments/[id]/page.tsx
- ContactAdvancedForm.tsx
- useInvoices.ts
- tasks/page.tsx
- ItemTable.tsx
- WidgetSkeleton.tsx
- CompanyProfileForm.tsx
- carousel.tsx
- dependencies
- InvoiceTable.tsx
- invoices/new/page.tsx
- ItemDocumentsTab.tsx
- ResolutionForm.tsx
- Extraction Subagent Prompt Template
- CalculationService (Backend)
- NewReturnForm
- remission.ts
- Sidebar.tsx
- ItemSidebar.tsx
- auth-context.tsx
- drawer.tsx
- invoices/page.tsx
- exports.md Reference Guide
- ReportsSections.tsx
- PersonalDataSection.tsx
- useCreateItem.ts
- chart.tsx
- TwoFactorPanel.tsx
- --update / --cluster-only subcommands (SKILL.md pointer)
- contacts/[id]/page.tsx
- input.tsx
- ConnectedDevicesSection.tsx
- /graphify Full Pipeline
- graphify Knowledge Graph System
- query.md Reference Guide
- PaymentDetailTabs.tsx
- ReturnsTable.tsx
- EmptyDashboardState.tsx
- tenant.ts
- update.md Reference Guide
- widget.interface.ts
- SoftwareList.tsx
- FactucoreLogo.tsx
- toggle-group.tsx
- package.json
- github-and-merge.md Reference Guide
- AddGraphMenu.tsx
- PaymentDetailInfo.tsx
- NewInvoiceView.tsx
- catalogCache.ts
- hooks.md Reference Guide
- transcribe.md Reference Guide
- Next.js Project (create-next-app bootstrap)
- MonthSelector.tsx
- CuentasPorCobrarWidget.tsx
- CuentasPorPagarWidget.tsx
- DeleteWidgetDialog.tsx
- invoice/InvoiceItemsTable.tsx
- DevolucionesWidget.tsx
- ImpuestosWidget.tsx
- next.config.ts
- contacts/layout.tsx
- dashboard/layout.tsx
- invoices/layout.tsx
- invoices/new/layout.tsx
- items/layout.tsx
- payments/new/layout.tsx
- ProductosVendidosSimpleWidget.tsx
- EmptyStateWidget.tsx
- dayjs
- DocumentTitleUpdater.tsx
- Loader.tsx
- proxy.ts
- axios
- clsx
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
- @radix-ui/react-checkbox
- @radix-ui/react-dialog
- Header.tsx
- @radix-ui/react-label
- @radix-ui/react-progress
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
- tailwind-merge
- tailwindcss-animate
- @tanstack/query-sync-storage-persister
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 198 edges
2. `showToast()` - 190 edges
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

## Communities (176 total, 65 thin omitted)

### Community 0 - "PaymentInvoicesList.tsx"
Cohesion: 0.14
Nodes (25): CertificateListProps, ContactTableBodyProps, InvoiceDetailDocument(), InvoiceDetailDocumentProps, DianStatusBadge(), parseDateSafe(), PaymentInvoicesList(), PaymentInvoicesListProps (+17 more)

### Community 1 - "tooltip.tsx"
Cohesion: 0.10
Nodes (22): FlujoTransaccionesData, FlujoTransaccionesWidgetProps, TotalVentasWidgetProps, VentasData, InvoiceDianStatusProps, PriceListEntry, WarehouseEntry, GeneralInfoSectionProps (+14 more)

### Community 2 - "dialog.tsx"
Cohesion: 0.06
Nodes (46): AttributeModalProps, NewCertificateModalProps, ConfigCostCentersModalProps, DOCUMENT_TYPES, CreateCurrencyModalProps, EditResolutionModalProps, PreviewModalProps, ProductGalleryModalProps (+38 more)

### Community 3 - "types/auth.ts"
Cohesion: 0.10
Nodes (28): ChangeEmailDialog(), ChangePasswordDialog(), TwoFactorPanel(), useChangeEmail(), useChangePassword(), useConfirmTwoFactor(), useDisableTwoFactor(), useEnableTwoFactor() (+20 more)

### Community 4 - "types/catalogs.ts"
Cohesion: 0.12
Nodes (15): Attribute, Category, Country, CustomField, Department, Municipality, Plan, PriceList (+7 more)

### Community 5 - "NewRemissionMain.tsx"
Cohesion: 0.21
Nodes (20): AddContactModal(), ContactAccountingInfoProps, ContactCommercialInfoProps, EditResolutionModal(), InvoiceItemsTable(), QuickCreateItemModal(), NewPaymentTermModal(), ResolutionFilterChipsProps (+12 more)

### Community 6 - "CustomToaster.tsx"
Cohesion: 0.14
Nodes (18): NewCertificateForm(), NewCertificateFormProps, InvoiceDetailHeaderProps, StatusBadge(), StatusBadge(), NewSoftwareForm(), NewSoftwareFormProps, CustomToastProps (+10 more)

### Community 7 - "menubar.tsx"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 8 - "sidebar.tsx"
Cohesion: 0.08
Nodes (28): Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+20 more)

### Community 9 - "remissions/[id]/edit/page.tsx"
Cohesion: 0.07
Nodes (30): EditRemissionPage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), RemissionDetailPage(), RemissionDetailDocument(), RemissionDetailExtraInfo(), RemissionDetailExtraInfoProps, RemissionDetailSkeleton() (+22 more)

### Community 10 - "quote.ts"
Cohesion: 0.06
Nodes (43): FacturasVentaViewProps, QuotesPage(), FacturasVentaViewProps, QuotesPage(), defaultFilterOptions, FilterOption, QuoteFilter(), QuoteFilterProps (+35 more)

### Community 11 - "ApiResponse"
Cohesion: 0.06
Nodes (25): CertificatesPage(), EditContactContent(), NewContactContent(), CertificateList(), NewCertificateModal(), NewQuoteOptions(), NewRemissionOptions(), envs (+17 more)

### Community 12 - "dashboard/page.tsx"
Cohesion: 0.15
Nodes (18): DashboardPage(), isPredefinedWidget(), PREDEFINED_POSITIONS, SortableWidgetProps, Widget, FlujoTransaccionesWidget(), TotalVentasWidget(), clientesConVentasMock (+10 more)

### Community 13 - "AuthService"
Cohesion: 0.10
Nodes (14): metadata, AccountSwitcher(), AccountSwitcherProps, HelpCenterPopover(), HelpCenterPopoverProps, CompanyData, CompanyHeaderPdfStyle(), CustomToaster() (+6 more)

### Community 14 - "button.tsx"
Cohesion: 0.11
Nodes (27): Contact, ContactType, ContactDetailHeaderProps, AvatarInitials(), getColorFromName(), getInitials(), FilterOption, InvoiceFilterProps (+19 more)

### Community 15 - "devDependencies"
Cohesion: 0.09
Nodes (23): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, shadcn (+15 more)

### Community 16 - "showToast"
Cohesion: 0.17
Nodes (17): EditResolutionPage(), NewResolutionPage(), ResolutionsPage(), NewInvoiceOptions(), NewInvoicePayment(), WithholdingsModal(), RemissionPageHeader(), ResolutionForm() (+9 more)

### Community 17 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 18 - "items/page.tsx"
Cohesion: 0.27
Nodes (8): ItemDetailPage(), FormState, ItemsPage(), ExportConfig, useDeleteItem(), useItems(), ToggleStatusParams, useToggleItemStatus()

### Community 19 - "types/items.ts"
Cohesion: 0.08
Nodes (30): Image, BaseItemBasicInfo, BaseItemPayload, ComboBasicInfo, ComboItemPayload, CreateItemAccounting, CreateItemComboComponent, CreateItemComboSettings (+22 more)

### Community 20 - "QuickCreateItemModal.tsx"
Cohesion: 0.10
Nodes (36): CategoryModalProps, NewCategoryModal(), CostCenter, NewCostCenterModal(), NewCostCenterModalProps, CustomFieldModal(), BLANK_BASIC, QuickCreateItemModalProps (+28 more)

### Community 21 - "components.json"
Cohesion: 0.08
Nodes (23): aliases, components, hooks, lib, ui, utils, Authorization, iconLibrary (+15 more)

### Community 22 - "returns/[id]/page.tsx"
Cohesion: 0.15
Nodes (10): ReturnDetailPage(), ReturnDetailHeader(), ReturnDetailSkeleton(), CREDIT_NOTE_KEY(), CREDIT_NOTES_KEY, useCreditNote(), useCreditNotesList(), useSendCreditNote() (+2 more)

### Community 23 - "useDebounce"
Cohesion: 0.17
Nodes (12): ContactPage(), ReturnsPage(), FilterOption, paymentFilterOptions, PaymentTableToolbar(), PaymentTableToolbarProps, ReturnPageHeader(), ReturnsTable() (+4 more)

### Community 24 - "CostCenterTable.tsx"
Cohesion: 0.10
Nodes (23): CostCentersPage(), ConfigCostCentersModal(), CostCenterTable(), CostCenterTableProps, ServerPagination, CostCenter, getColumns(), CostCenterFilter() (+15 more)

### Community 25 - "lib/utils.ts"
Cohesion: 0.17
Nodes (20): CustomFieldModalProps, FALLBACK_FIELD_TYPES, QuoteItemsTable(), RemissionItemsTable(), FilterOption, RETURN_FILTER_OPTIONS, ReturnsFilterChips(), ReturnsFilterChipsProps (+12 more)

### Community 26 - "lib/items.ts"
Cohesion: 0.20
Nodes (10): EditItemPage(), UseItemsParams, useItemById(), useUpdateItem(), itemsApi, PaginatedData, GetItemByIdResponse, ItemsListApiData (+2 more)

### Community 27 - "ui/utils.ts"
Cohesion: 0.09
Nodes (14): ContactDetailGeneralProps, AccordionContent(), AccordionItem(), AccordionTrigger(), Alert(), AlertDescription(), AlertTitle(), alertVariants (+6 more)

### Community 28 - "PaymentTable.tsx"
Cohesion: 0.13
Nodes (20): PaymentsPage(), PaymentTable(), PaymentTableProps, SelectionState, ServerPagination, getPaymentColumns(), filterLabels, MOCK_BANK_ACCOUNTS (+12 more)

### Community 29 - "react"
Cohesion: 0.10
Nodes (20): react, react, AttributeModal(), NewCurrencyModal(), FormattedInput(), NewInvoiceComments(), FormattedInput(), FormattedInput() (+12 more)

### Community 30 - "resolveStockFields"
Cohesion: 0.24
Nodes (15): getSession(), ItemRow(), NewInvoiceMain(), NewQuoteMain(), ItemRow(), NewRemissionMain(), ItemRow(), showToastWithAction() (+7 more)

### Community 31 - "InvoicesService"
Cohesion: 0.20
Nodes (3): InvoiceDetailPage(), InvoicesService, Invoice

### Community 32 - "useQuotes.ts"
Cohesion: 0.07
Nodes (20): QuoteDetailPage(), DOCUMENT_TYPES, DocumentType, QuoteDetailExtraInfo(), QuoteDetailExtraInfoProps, QuoteDetailHeader(), QuoteDetailSkeleton(), QuoteDetailSummary() (+12 more)

### Community 33 - "invoices/[id]/page.tsx"
Cohesion: 0.16
Nodes (8): InvoiceDetailExtraInfo(), InvoiceDetailExtraInfoProps, InvoiceDetailHeader(), InvoiceDetailSummary(), InvoiceDetailSummaryProps, InvoiceDetailTabs(), InvoiceDianStatus(), ActionsCell()

### Community 34 - "RemissionTable.tsx"
Cohesion: 0.12
Nodes (22): FacturasVentaViewProps, RemissionsPage(), defaultFilterOptions, RemissionFilter(), RemissionTable(), RemissionTableProps, ServerPagination, getColumns() (+14 more)

### Community 35 - "ContactTable.tsx"
Cohesion: 0.10
Nodes (20): Contact, ContactTable(), ContactTableProps, SelectionState, ServerPagination, Contact, getContactColumns(), ContactFilterChips() (+12 more)

### Community 36 - "items/[id]/page.tsx"
Cohesion: 0.11
Nodes (15): ItemAccounting(), ItemAttachments(), TabConfig, ItemHeader(), ItemHeaderProps, ItemInventory(), ItemInventoryProps, InfoChip() (+7 more)

### Community 37 - "invoice.ts"
Cohesion: 0.13
Nodes (15): AllowanceCharge, InvoiceBill, InvoiceBillingPeriod, InvoiceCompany, InvoiceCustomer, InvoiceDetailResponse, InvoiceDian, InvoiceEstablishment (+7 more)

### Community 38 - "cn"
Cohesion: 0.11
Nodes (23): StatusToggle(), formatMoney(), getItemTypeName(), InfoChip(), InfoField(), ItemDetailView(), StatusToggle(), TabButton() (+15 more)

### Community 39 - "errors.ts"
Cohesion: 0.11
Nodes (23): ActivateAccountPage(), ConfirmEmailPage(), ForgotPasswordPage(), ResetPasswordPage(), AuthLinkStatus(), AuthLinkStatusProps, PasswordResetForm(), LogoHorizontal() (+15 more)

### Community 40 - "IntegrationsService"
Cohesion: 0.08
Nodes (20): ApiKeysTab(), CreateApiKeyModal(), CreateWebhookModal(), CreateWebhookModalProps, RotateSecretModal(), RotateSecretModalProps, WebhookDeliveriesModal(), WebhookDeliveriesModalProps (+12 more)

### Community 41 - "formatCurrency"
Cohesion: 0.23
Nodes (9): PaymentDetailAccountingAccounts(), PaymentDetailAccountingAccountsProps, PaymentDetailTotal(), PaymentDetailTotalProps, ReturnDetailSummary(), ReturnDetailSummaryProps, ReturnDetailTabs(), ReturnDetailTabsProps (+1 more)

### Community 42 - "ResolutionTable.tsx"
Cohesion: 0.16
Nodes (12): ResolutionTable(), ResolutionTableProps, ServerPagination, getResolutionColumns(), ResolutionFilterChips(), ResolutionTableBody(), ResolutionTableBodyProps, ResolutionTablePagination() (+4 more)

### Community 43 - "cn"
Cohesion: 0.06
Nodes (44): AlertDialogOverlay(), Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList() (+36 more)

### Community 44 - "payments/[id]/page.tsx"
Cohesion: 0.18
Nodes (8): PaymentDetailPage(), NewPaymentPage(), Attachment, PaymentDetailAttachments(), PaymentDetailAttachmentsProps, PaymentDetailHeader(), usePayment(), PaymentsService

### Community 45 - "ContactAdvancedForm.tsx"
Cohesion: 0.15
Nodes (19): AddContactModalProps, ModalContent(), PrefilledContactData, ContactAccountingInfo(), ContactAdvancedForm(), ContactAdvancedFormProps, ContactBasicForm(), ContactBasicFormProps (+11 more)

### Community 46 - "useInvoices.ts"
Cohesion: 0.29
Nodes (8): InvoiceEditPage(), INVOICE_KEY(), INVOICES_KEY, useInvoice(), usePrefetchInvoiceDetail(), useSendInvoice(), useUpdateInvoice(), InvoiceListData

### Community 47 - "tasks/page.tsx"
Cohesion: 0.16
Nodes (10): NewTaskDrawer(), NewTaskDrawerProps, ASSIGNEE_OPTIONS, FILTER_TABS, PRIORITY_OPTIONS, STATUS_OPTIONS, TaskFiltersPopup(), TaskFiltersPopupProps (+2 more)

### Community 48 - "ItemTable.tsx"
Cohesion: 0.11
Nodes (20): ItemTable(), ItemTableProps, SelectionState, ServerPagination, getItemColumns(), filterLabels, ItemFilterChips(), ItemFilterChipsProps (+12 more)

### Community 50 - "CompanyProfileForm.tsx"
Cohesion: 0.29
Nodes (6): CompanyProfileForm(), getInitials(), useUpdateCompanyProfile(), CompanyProfileService, CompanyProfileUpdatePayload, CompanyProfileUpdateResponse

### Community 51 - "carousel.tsx"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 52 - "dependencies"
Cohesion: 0.07
Nodes (27): class-variance-authority, cmdk, date-fns, jspdf, lucide-react, dependencies, class-variance-authority, cmdk (+19 more)

### Community 53 - "InvoiceTable.tsx"
Cohesion: 0.12
Nodes (21): defaultFilterOptions, InvoiceTable(), InvoiceTableProps, ServerPagination, getColumns(), FilterChips(), FilterChipsProps, filterIcons (+13 more)

### Community 54 - "invoices/new/page.tsx"
Cohesion: 0.11
Nodes (36): NewInvoicePage(), EditQuotePage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), NewQuotePage(), NewRemissionPage(), SessionData, NewInvoiceFooter() (+28 more)

### Community 55 - "ItemDocumentsTab.tsx"
Cohesion: 0.32
Nodes (11): formatMoney(), getClientName(), getDocDate(), getDocNumber(), getDocStatus(), getDocTotal(), ItemDocumentsTab(), resolveDoc() (+3 more)

### Community 56 - "ResolutionForm.tsx"
Cohesion: 0.18
Nodes (15): baseSchema, formSchema, ResolutionFormProps, FormControl(), FormDescription(), FormField(), FormFieldContext, FormFieldContextValue (+7 more)

### Community 57 - "Extraction Subagent Prompt Template"
Cohesion: 0.18
Nodes (11): Confidence Score Rubric (EXTRACTED/INFERRED/AMBIGUOUS), extraction-spec.md Reference Guide, Hyperedge Extraction Rule, Node ID Format Spec ({stem}_{entity}), semantically_similar_to Edge Rule, Extraction Subagent Prompt Template, Honesty Rules, Part A: Structural (AST) extraction (+3 more)

### Community 58 - "CalculationService (Backend)"
Cohesion: 0.42
Nodes (11): CalculationService (Backend), Rationale: Frontend Must Not Send Monetary Amounts, credit_note_reference_index field, POST /api/credit-notes endpoint, POST /api/credit-notes/send endpoint, Tipo 1: Devolución Parcial (Ajuste de Cantidad), Tipo 2: Anulación Completa de la Factura, Tipo 3 y 6: Rebaja / Descuento a Líneas (+3 more)

### Community 59 - "NewReturnForm"
Cohesion: 0.31
Nodes (3): NewReturnForm(), createEmptyLine(), NewReturnForm()

### Community 60 - "remission.ts"
Cohesion: 0.14
Nodes (13): AllowanceCharge, RemissionBill, RemissionBillingPeriod, RemissionCompany, RemissionCustomer, RemissionDian, RemissionEstablishment, RemissionFindAllEmpty (+5 more)

### Community 61 - "Sidebar.tsx"
Cohesion: 0.20
Nodes (11): AuthenticatedLayout(), Header(), Logo(), CollapseButton(), MenuItem(), MenuItemProps, Sidebar(), SidebarMenuItem (+3 more)

### Community 62 - "ItemSidebar.tsx"
Cohesion: 0.36
Nodes (7): ItemImage, ImageUploader(), ImageUploaderProps, ItemGalleryModal(), ItemGalleryModalProps, ItemSidebar(), ItemSidebarProps

### Community 63 - "auth-context.tsx"
Cohesion: 0.18
Nodes (13): CompanyProfilePage(), LoginPage(), RootPage(), UserMenu(), UserMenuProps, AuthContext, AuthContextType, BackendUser (+5 more)

### Community 64 - "drawer.tsx"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 65 - "invoices/page.tsx"
Cohesion: 0.28
Nodes (7): FacturasVentaViewProps, InvoicesPage(), InvoicePageHeader(), InvoiceStats, StatCard(), StatCardProps, useInvoicesList()

### Community 66 - "exports.md Reference Guide"
Cohesion: 0.22
Nodes (9): Token reduction benchmark (Step 8), --falkordb / --falkordb-push export (Step 7a), --graphml export (Step 7c), exports.md Reference Guide, --mcp MCP stdio server (Step 7d), --neo4j / --neo4j-push export (Step 7), --svg export (Step 7b), --wiki export (Step 6b) (+1 more)

### Community 67 - "ReportsSections.tsx"
Cohesion: 0.33
Nodes (5): CategoryCard(), CategoryCardProps, ReportsCategoryGrid(), ReportsHeader(), ReportsSearchBar()

### Community 68 - "PersonalDataSection.tsx"
Cohesion: 0.24
Nodes (10): SecurityPage(), InvoiceDetailSkeleton(), getInitials(), isTenantProfile(), PersonalDataSection(), TwoFactorSection(), Skeleton(), useProfile() (+2 more)

### Community 69 - "useCreateItem.ts"
Cohesion: 0.31
Nodes (6): NewItemPage(), NewItemForm(), NewItemFormProps, useCreateItem(), useItemForm(), CreateItemPayload

### Community 70 - "chart.tsx"
Cohesion: 0.14
Nodes (18): DistribucionGastosWidget(), DistribucionGastosWidgetProps, GastoItem, ClienteItem, MejoresClientesWidget(), MejoresClientesWidgetProps, ProductoItem, ProductosMasVendidosWidget() (+10 more)

### Community 71 - "TwoFactorPanel.tsx"
Cohesion: 0.09
Nodes (21): CreateApiKeyModalProps, RecoveryCodesDisplay(), RecoveryCodesDisplayProps, ENABLE_STEP_PROGRESS, OTP_SLOTS, Step, TwoFactorPanelProps, Badge() (+13 more)

### Community 72 - "--update / --cluster-only subcommands (SKILL.md pointer)"
Cohesion: 0.29
Nodes (7): /graphify add <url>, add-watch.md Reference Guide, --watch (background folder watcher), /graphify add and --watch flow (SKILL.md pointer), Interpreter guard for subcommands, /graphify query flow (SKILL.md pointer), --update / --cluster-only subcommands (SKILL.md pointer)

### Community 73 - "contacts/[id]/page.tsx"
Cohesion: 0.15
Nodes (12): ContactDetailPage(), ContactDetailAttachments(), ContactDetailAttachmentsProps, ContactDetailBranches(), ContactDetailBranchesProps, ContactDetailComments(), ContactDetailCommentsProps, ContactDetailGeneral() (+4 more)

### Community 74 - "input.tsx"
Cohesion: 0.27
Nodes (13): PasswordResetFormProps, TwoFactorChallengeForm(), TwoFactorChallengeFormProps, ChangeEmailDialogProps, ChangePasswordDialogProps, PasswordGateDialogProps, Field(), FieldDescription() (+5 more)

### Community 75 - "ConnectedDevicesSection.tsx"
Cohesion: 0.36
Nodes (4): ConnectedDevicesSection(), formatRelativeTime(), useDevices(), useRevokeDevice()

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
Cohesion: 0.38
Nodes (4): PaymentDetailAccounting(), PaymentDetailAdvances(), PaymentDetailTabs(), PaymentDetailTabsProps

### Community 80 - "ReturnsTable.tsx"
Cohesion: 0.33
Nodes (5): ReturnsTableProps, ReturnsTableBody(), ReturnsTablePagination(), ReturnsTablePaginationProps, ReturnsTableToolbar()

### Community 81 - "EmptyDashboardState.tsx"
Cohesion: 0.27
Nodes (4): EmptyDashboardState(), EmptyDashboardStateProps, ClientesConVentasWidget(), ClientesConVentasWidgetProps

### Community 82 - "tenant.ts"
Cohesion: 0.29
Nodes (6): CreateTenantInput, createTenantSchema, Tenant, tenantSchema, UpdateTenantInput, updateTenantSchema

### Community 83 - "update.md Reference Guide"
Cohesion: 0.33
Nodes (6): build_merge() / graph_diff(), --cluster-only, update.md Reference Guide, --update (incremental re-extraction), Step 4.5: Graph health check, Step 4: Build graph, cluster, analyze, generate outputs

### Community 84 - "widget.interface.ts"
Cohesion: 0.33
Nodes (3): DashboardViewProps, SortableWidgetProps, Widget

### Community 85 - "SoftwareList.tsx"
Cohesion: 0.27
Nodes (8): SoftwarePage(), NewSoftwareModal(), SoftwareList(), SoftwareListProps, CreateSoftwarePayload, Software, SoftwareResponse, softwaresApi

### Community 86 - "FactucoreLogo.tsx"
Cohesion: 0.17
Nodes (10): Factucore Horizontal Logo, FactucoreLogo(), FactucoreLogoProps, CompanySummaryCard(), ConfigCard(), ConfigCardProps, ConfigLink, ConfigurationGrid() (+2 more)

### Community 87 - "toggle-group.tsx"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 88 - "package.json"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 89 - "github-and-merge.md Reference Guide"
Cohesion: 0.60
Nodes (5): graphify clone <github-url>, github-and-merge.md Reference Guide, graphify merge-graphs, Monorepo / multi-subfolder merge flow, Step 0: GitHub repos and multi-path merge

### Community 90 - "AddGraphMenu.tsx"
Cohesion: 0.40
Nodes (4): AddGraphMenu(), AddGraphMenuProps, allGraphOptions, GraphOption

### Community 91 - "PaymentDetailInfo.tsx"
Cohesion: 0.50
Nodes (3): PaymentDetailInfo(), PaymentDetailInfoProps, PaymentStatusBadge()

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

### Community 141 - "Header.tsx"
Cohesion: 0.16
Nodes (17): HeaderProps, SolutionsPopover(), SolutionsPopoverProps, AsyncSearchableSelectOption, AsyncSearchableSelectProps, Command(), CommandDialog(), CommandEmpty() (+9 more)

## Knowledge Gaps
- **560 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+555 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **65 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `tooltip.tsx`, `NewRemissionMain.tsx`, `CustomToaster.tsx`, `sidebar.tsx`, `remissions/[id]/edit/page.tsx`, `quote.ts`, `ApiResponse`, `showToast`, `items/page.tsx`, `QuickCreateItemModal.tsx`, `useDebounce`, `CostCenterTable.tsx`, `lib/utils.ts`, `ui/utils.ts`, `PaymentTable.tsx`, `useQuotes.ts`, `invoices/[id]/page.tsx`, `RemissionTable.tsx`, `ContactTable.tsx`, `items/[id]/page.tsx`, `cn`, `ResolutionTable.tsx`, `payments/[id]/page.tsx`, `ItemTable.tsx`, `carousel.tsx`, `dependencies`, `InvoiceTable.tsx`, `invoices/new/page.tsx`, `ItemDocumentsTab.tsx`, `ResolutionForm.tsx`, `Sidebar.tsx`, `ItemSidebar.tsx`, `invoices/page.tsx`, `useCreateItem.ts`, `chart.tsx`, `TwoFactorPanel.tsx`, `ReturnsTable.tsx`, `SoftwareList.tsx`, `toggle-group.tsx`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `showToast()` connect `showToast` to `PaymentInvoicesList.tsx`, `tooltip.tsx`, `dialog.tsx`, `types/auth.ts`, `NewRemissionMain.tsx`, `CustomToaster.tsx`, `remissions/[id]/edit/page.tsx`, `quote.ts`, `ApiResponse`, `dashboard/page.tsx`, `AuthService`, `button.tsx`, `items/page.tsx`, `QuickCreateItemModal.tsx`, `returns/[id]/page.tsx`, `CostCenterTable.tsx`, `lib/utils.ts`, `lib/items.ts`, `PaymentTable.tsx`, `react`, `resolveStockFields`, `InvoicesService`, `useQuotes.ts`, `invoices/[id]/page.tsx`, `cn`, `errors.ts`, `IntegrationsService`, `payments/[id]/page.tsx`, `ContactAdvancedForm.tsx`, `CompanyProfileForm.tsx`, `invoices/new/page.tsx`, `ResolutionForm.tsx`, `NewReturnForm`, `Sidebar.tsx`, `auth-context.tsx`, `PersonalDataSection.tsx`, `useCreateItem.ts`, `TwoFactorPanel.tsx`, `contacts/[id]/page.tsx`, `input.tsx`, `ConnectedDevicesSection.tsx`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `dialog.tsx`, `NewRemissionMain.tsx`, `CustomToaster.tsx`, `menubar.tsx`, `sidebar.tsx`, `Header.tsx`, `button.tsx`, `QuickCreateItemModal.tsx`, `lib/utils.ts`, `ui/utils.ts`, `errors.ts`, `IntegrationsService`, `carousel.tsx`, `ResolutionForm.tsx`, `drawer.tsx`, `chart.tsx`, `TwoFactorPanel.tsx`, `input.tsx`, `toggle-group.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _560 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PaymentInvoicesList.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1411764705882353 - nodes in this community are weakly interconnected._
- **Should `tooltip.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10299003322259136 - nodes in this community are weakly interconnected._
- **Should `dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0633964429145152 - nodes in this community are weakly interconnected._