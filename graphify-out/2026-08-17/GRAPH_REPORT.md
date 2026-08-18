# Graph Report - facturacion-cliente  (2026-08-17)

## Corpus Check
- 540 files · ~290,506 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2465 nodes · 7347 edges · 201 communities (117 shown, 84 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6c89cb65`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- table.tsx
- AdvancedOptionsSection.tsx
- dialog.tsx
- types/auth.ts
- types/catalogs.ts
- NewRemissionMain.tsx
- tooltip.tsx
- payments/[id]/page.tsx
- sidebar.tsx
- remissions/[id]/edit/page.tsx
- quote.ts
- ApiResponse
- dashboard/page.tsx
- AuthService
- button.tsx
- devDependencies
- useNotifications.ts
- compilerOptions
- items/page.tsx
- types/items.ts
- CustomToaster.tsx
- components.json
- CreditNotesService
- contacts/page.tsx
- CostCenterTable.tsx
- cn
- lib/items.ts
- contacts/[id]/page.tsx
- Comentarios con @mentions + Notificaciones en tiempo real
- react
- useCatalogs
- InvoicesService
- useQuotes.ts
- invoices/[id]/page.tsx
- remission.ts
- invoice/table/FilterChips.tsx
- items/[id]/page.tsx
- invoice.ts
- usePurchaseOrders.ts
- errors.ts
- NewCertificateForm.tsx
- returns/[id]/page.tsx
- showToast
- cn
- PaymentTable.tsx
- ContactAdvancedForm.tsx
- useInvoices.ts
- tasks/page.tsx
- ItemTable.tsx
- DropdownMenuItem
- useCompanyProfile.ts
- carousel.tsx
- axios
- InvoiceTable.tsx
- CostCenterFilter.tsx
- ItemDocumentsTab.tsx
- ResolutionForm.tsx
- Extraction Subagent Prompt Template
- CalculationService (Backend)
- menubar.tsx
- extractErrorMessage
- Sidebar.tsx
- PaymentDetailTabs.tsx
- auth-context.tsx
- ui/utils.ts
- invoices/page.tsx
- exports.md Reference Guide
- ReportsSections.tsx
- ProfileService
- NewReturnForm
- chart.tsx
- TwoFactorPanel.tsx
- --update / --cluster-only subcommands (SKILL.md pointer)
- Órdenes de compra: separación Ingresos (externas) vs Gastos (internas)
- CompanyProfileForm.tsx
- ItemDetailView.tsx
- /graphify Full Pipeline
- graphify Knowledge Graph System
- query.md Reference Guide
- NewReturnForm.tsx
- ReturnsTableBody.tsx
- EmptyDashboardState.tsx
- tenant.ts
- update.md Reference Guide
- widget.interface.ts
- SoftwareList.tsx
- CompanySummaryCard.tsx
- ItemFilterChips.tsx
- FlujoTransaccionesWidget.tsx
- github-and-merge.md Reference Guide
- AddGraphMenu.tsx
- ContactDetailGeneral.tsx
- TotalVentasWidget.tsx
- catalogCache.ts
- hooks.md Reference Guide
- transcribe.md Reference Guide
- Next.js Project (create-next-app bootstrap)
- MonthSelector.tsx
- CuentasPorCobrarWidget.tsx
- CuentasPorPagarWidget.tsx
- users/page.tsx
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
- alert.tsx
- EmptyStateWidget.tsx
- dayjs
- DocumentTitleUpdater.tsx
- Loader.tsx
- proxy.ts
- NewInvoiceView.tsx
- DeleteWidgetDialog.tsx
- PersonalDataSection.tsx
- geist
- dependencies
- @dnd-kit/modifiers
- ClientesConVentasWidget.tsx
- @dnd-kit/utilities
- embla-carousel-react
- eslint.config.mjs
- next-themes
- @hookform/resolvers
- html2canvas
- input-otp
- DevolucionesWidget.tsx
- next
- react-hook-form
- radix-ui
- ProductosVendidosSimpleWidget.tsx
- clsx
- @radix-ui/react-checkbox
- WidgetSkeleton.tsx
- Header.tsx
- @radix-ui/react-label
- @radix-ui/react-progress
- lucide-react
- pusher-js
- jspdf
- @radix-ui/react-tabs
- laravel-echo
- @radix-ui/react-toggle-group
- @radix-ui/react-accordion
- postcss
- react-dom
- react-qr-code
- react-resizable-panels
- @radix-ui/react-alert-dialog
- sonner
- @radix-ui/react-aspect-ratio
- tailwind-merge
- @radix-ui/react-avatar
- @tanstack/query-sync-storage-persister
- @radix-ui/react-dialog
- @tanstack/react-query-persist-client
- @radix-ui/react-dropdown-menu
- vaul
- @radix-ui/react-context-menu
- postcss.config.mjs
- afleones (User/Author Persona)
- globals.css.d.ts
- global.d.ts
- newInvoiceMockData.ts
- FactuCore Logo
- Login Page Illustration (Facturación Electrónica)
- @radix-ui/react-menubar
- @radix-ui/react-hover-card
- @radix-ui/react-navigation-menu
- @radix-ui/react-radio-group
- @radix-ui/react-slot
- @radix-ui/react-select
- @radix-ui/react-toggle
- @radix-ui/react-separator
- @radix-ui/react-slider
- @radix-ui/react-switch
- @tabler/icons-react
- class-variance-authority
- react-day-picker
- recharts
- tailwindcss-animate
- @tanstack/react-query
- zod

## God Nodes (most connected - your core abstractions)
1. `showToast()` - 210 edges
2. `cn()` - 198 edges
3. `cn()` - 141 edges
4. `react` - 120 edges
5. `Button()` - 112 edges
6. `ApiResponse` - 55 edges
7. `useCatalogs()` - 53 edges
8. `DialogContent()` - 52 edges
9. `DialogTitle()` - 52 edges
10. `Dialog()` - 51 edges

## Surprising Connections (you probably didn't know these)
- `CertificatesPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/certificates/page.tsx → package.json
- `SoftwarePage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/software/page.tsx → package.json
- `ContactPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/contacts/page.tsx → package.json
- `QuotesPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/cotizaciones/page.tsx → package.json
- `InternalPurchaseOrdersPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/gastos/ordenes-compra/page.tsx → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Modular Reference-Doc Loading Pattern** — claude_skills_graphify_skill_step0_github_merge, claude_skills_graphify_skill_step2_5_transcribe, claude_skills_graphify_skill_part_b_semantic_extraction, claude_skills_graphify_skill_update_cluster_only, claude_skills_graphify_skill_query_flow, claude_skills_graphify_skill_add_watch_flow, claude_skills_graphify_skill_hooks_integration, claude_skills_graphify_skill_exports_flow [INFERRED 0.85]
- **Self-Improving Query Feedback Loop (save-result + reflect)** — claude_skills_graphify_references_query_query_command, claude_skills_graphify_references_query_path_command, claude_skills_graphify_references_query_explain_command, claude_skills_graphify_references_query_save_result_command, claude_skills_graphify_references_query_reflect_command [EXTRACTED 1.00]
- **Incremental Update Manifest & Merge Integrity Guards** — claude_skills_graphify_references_update_update_flag, claude_skills_graphify_references_update_build_merge_function, claude_skills_graphify_skill_step9_cleanup_report [INFERRED 0.75]
- **Credit Note Types Using Line-Level Adjustments with CalculationService** — payload_examples_type1, payload_examples_type3, payload_examples_type4, payload_examples_type5, payload_examples_calculation_service [INFERRED 0.85]
- **graphify CLI Subcommands** — claude_md_graphify_query, claude_md_graphify_path, claude_md_graphify_explain, claude_md_graphify_update [EXTRACTED 1.00]

## Communities (201 total, 84 thin omitted)

### Community 0 - "table.tsx"
Cohesion: 0.10
Nodes (34): CertificatesPage(), CertificateList(), CertificateListProps, NewCertificateModal(), ContactTableBody(), ContactTableBodyProps, InvoiceDetailDocumentProps, DianStatusBadge() (+26 more)

### Community 1 - "AdvancedOptionsSection.tsx"
Cohesion: 0.16
Nodes (14): AdvancedOptionsSection(), ComboProductEntry, PriceListEntry, WarehouseEntry, GeneralInfoSectionProps, ItemType, ComboProductData, SectionCard() (+6 more)

### Community 2 - "dialog.tsx"
Cohesion: 0.08
Nodes (36): AttributeModalProps, NewCertificateModalProps, ConfigCostCentersModalProps, DOCUMENT_TYPES, CreateCurrencyModalProps, ProductGalleryModalProps, ExportItemsModalProps, CreateWarehouseModalProps (+28 more)

### Community 3 - "types/auth.ts"
Cohesion: 0.12
Nodes (21): ChangeEmailDialog(), useChangeEmail(), useConfirmTwoFactor(), useDisableTwoFactor(), useVerifyPassword(), ChangeEmailPayload, DeviceSession, ForgotPasswordResponse (+13 more)

### Community 4 - "types/catalogs.ts"
Cohesion: 0.12
Nodes (15): Attribute, Category, Country, CustomField, Department, Municipality, Plan, PriceList (+7 more)

### Community 5 - "NewRemissionMain.tsx"
Cohesion: 0.10
Nodes (47): FactucoreLogo(), FactucoreLogoProps, AddContactModal(), ContactAccountingInfoProps, ContactCommercialInfoProps, InvoiceItemsTable(), QuickCreateItemModal(), ProductComboModal() (+39 more)

### Community 6 - "tooltip.tsx"
Cohesion: 0.12
Nodes (25): InvoiceDetailHeaderProps, InvoiceDianStatusProps, contactLabel(), PurchaseOrderDetailView(), contactLabel(), InternalPurchaseOrderDetailView(), lineTotal(), PurchaseOrderStatusBadge() (+17 more)

### Community 7 - "payments/[id]/page.tsx"
Cohesion: 0.13
Nodes (12): PaymentDetailPage(), NewPaymentPage(), Attachment, PaymentDetailAttachments(), PaymentDetailAttachmentsProps, PaymentDetailHeader(), PaymentDetailInfo(), PaymentDetailInfoProps (+4 more)

### Community 8 - "sidebar.tsx"
Cohesion: 0.08
Nodes (28): Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+20 more)

### Community 9 - "remissions/[id]/edit/page.tsx"
Cohesion: 0.07
Nodes (29): EditRemissionPage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), RemissionDetailPage(), RemissionDetailExtraInfo(), RemissionDetailExtraInfoProps, RemissionDetailSkeleton(), RemissionDetailSummary() (+21 more)

### Community 10 - "quote.ts"
Cohesion: 0.06
Nodes (39): FacturasVentaViewProps, QuotesPage(), FacturasVentaViewProps, QuotesPage(), defaultFilterOptions, QuoteFilter(), QuotePageHeader(), QuoteTable() (+31 more)

### Community 11 - "ApiResponse"
Cohesion: 0.07
Nodes (19): NewInvoiceOptions(), NewQuoteOptions(), NewQuoteSettingsDrawer(), NewRemissionOptions(), NewRemissionSettingsDrawer(), envs, ApiClient, AttributePayload (+11 more)

### Community 12 - "dashboard/page.tsx"
Cohesion: 0.18
Nodes (16): DashboardPage(), isPredefinedWidget(), PREDEFINED_POSITIONS, SortableWidgetProps, Widget, clientesConVentasMock, cuentasPorCobrarMock, cuentasPorPagarMock (+8 more)

### Community 13 - "AuthService"
Cohesion: 0.09
Nodes (14): metadata, AccountSwitcher(), AccountSwitcherProps, HelpCenterPopover(), HelpCenterPopoverProps, NewPaymentForm(), CustomToaster(), ThemeProvider() (+6 more)

### Community 14 - "button.tsx"
Cohesion: 0.10
Nodes (25): ContactDetailBranchesProps, CreateWebhookModalProps, InvoicePageHeaderProps, NewInvoiceFooter(), StatusToggle(), PaymentDetailHeaderProps, QuoteDetailHeader(), QuoteDetailHeaderProps (+17 more)

### Community 15 - "devDependencies"
Cohesion: 0.06
Nodes (32): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, shadcn (+24 more)

### Community 16 - "useNotifications.ts"
Cohesion: 0.17
Nodes (16): DOCUMENT_ROUTES, NotificationBell(), timeAgo(), getChannelName(), LIST_KEY(), UNREAD_COUNT_KEY, useMarkAllNotificationsRead(), useMarkNotificationRead() (+8 more)

### Community 17 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 18 - "items/page.tsx"
Cohesion: 0.19
Nodes (12): ItemDetailPage(), NewItemPage(), FormState, ItemsPage(), ExportConfig, ExportItemsModal(), NewItemFormProps, useCreateItem() (+4 more)

### Community 19 - "types/items.ts"
Cohesion: 0.08
Nodes (30): Image, BaseItemBasicInfo, BaseItemPayload, ComboBasicInfo, ComboItemPayload, CreateItemAccounting, CreateItemComboComponent, CreateItemComboSettings (+22 more)

### Community 20 - "CustomToaster.tsx"
Cohesion: 0.09
Nodes (40): CategoryModalProps, NewCategoryModal(), CostCenter, NewCostCenterModal(), NewCostCenterModalProps, NewCurrencyModal(), BLANK_BASIC, QuickCreateItemModalProps (+32 more)

### Community 21 - "components.json"
Cohesion: 0.08
Nodes (23): aliases, components, hooks, lib, ui, utils, Authorization, iconLibrary (+15 more)

### Community 22 - "CreditNotesService"
Cohesion: 0.15
Nodes (9): ReturnDetailPage(), ReturnsPage(), CREDIT_NOTE_KEY(), CREDIT_NOTES_KEY, useCreditNote(), useCreditNotesList(), useSendCreditNote(), CreditNotesService (+1 more)

### Community 23 - "contacts/page.tsx"
Cohesion: 0.14
Nodes (15): Contact, ContactPage(), ContactType, ContactTable(), getContactColumns(), FilterOption, paymentFilterOptions, PaymentTableToolbar() (+7 more)

### Community 24 - "CostCenterTable.tsx"
Cohesion: 0.16
Nodes (14): CostCenterTable(), CostCenterTableProps, ServerPagination, CostCenter, getColumns(), CostCenterTableBody(), CostCenterTableBodyProps, CostCenterTablePagination() (+6 more)

### Community 25 - "cn"
Cohesion: 0.14
Nodes (26): ItemImage, CustomFieldModal(), CustomFieldModalProps, FALLBACK_FIELD_TYPES, AdditionalFieldsSection(), CustomFieldDatePicker(), ImageUploader(), ImageUploaderProps (+18 more)

### Community 26 - "lib/items.ts"
Cohesion: 0.20
Nodes (10): EditItemPage(), UseItemsParams, useItemById(), useUpdateItem(), itemsApi, PaginatedData, GetItemByIdResponse, ItemsListApiData (+2 more)

### Community 27 - "contacts/[id]/page.tsx"
Cohesion: 0.15
Nodes (12): ContactDetailPage(), ContactDetailAttachments(), ContactDetailAttachmentsProps, ContactDetailBranches(), ContactDetailComments(), ContactDetailCommentsProps, ContactDetailHeader(), ContactDetailHeaderProps (+4 more)

### Community 28 - "Comentarios con @mentions + Notificaciones en tiempo real"
Cohesion: 0.08
Nodes (23): API — Comentarios, API — Notificaciones, Arquitectura, Campanita del navbar/header, Comentarios con @mentions + Notificaciones en tiempo real, `DELETE /v1/comments/{id}`, Despliegue en Railway — servicio nuevo `factucore_websockets`, `GET /v1/comments/mentionable-users?search=jua` (+15 more)

### Community 29 - "react"
Cohesion: 0.09
Nodes (20): react, react, AttributeModal(), ConfigCostCentersModal(), FormattedInput(), NewInvoiceComments(), FormattedInput(), FormattedInput() (+12 more)

### Community 30 - "useCatalogs"
Cohesion: 0.08
Nodes (51): EditContactContent(), NewInvoicePage(), EditQuotePage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), NewQuotePage(), NewRemissionPage(), getSession() (+43 more)

### Community 31 - "InvoicesService"
Cohesion: 0.16
Nodes (5): InvoiceDetailPage(), InvoiceDianStatus(), useSendInvoice(), InvoicesService, Invoice

### Community 32 - "useQuotes.ts"
Cohesion: 0.08
Nodes (17): QuoteDetailPage(), DOCUMENT_TYPES, DocumentType, QuoteDetailExtraInfo(), QuoteDetailExtraInfoProps, QuoteDetailSkeleton(), QuoteDetailSummary(), QuoteDetailSummaryProps (+9 more)

### Community 33 - "invoices/[id]/page.tsx"
Cohesion: 0.16
Nodes (9): InvoiceDetailDocument(), InvoiceDetailExtraInfo(), InvoiceDetailExtraInfoProps, InvoiceDetailHeader(), InvoiceDetailSkeleton(), InvoiceDetailSummary(), InvoiceDetailSummaryProps, InvoiceDetailTabs() (+1 more)

### Community 34 - "remission.ts"
Cohesion: 0.07
Nodes (37): FacturasVentaViewProps, RemissionsPage(), defaultFilterOptions, RemissionFilter(), RemissionTable(), RemissionTableProps, ServerPagination, getColumns() (+29 more)

### Community 35 - "invoice/table/FilterChips.tsx"
Cohesion: 0.08
Nodes (22): Contact, ContactTableProps, SelectionState, ServerPagination, ContactFilterChips(), ContactTablePagination(), ContactTablePaginationProps, ServerPagination (+14 more)

### Community 36 - "items/[id]/page.tsx"
Cohesion: 0.11
Nodes (15): ItemAccounting(), ItemAttachments(), TabConfig, ItemHeader(), ItemHeaderProps, ItemInventory(), ItemInventoryProps, InfoChip() (+7 more)

### Community 37 - "invoice.ts"
Cohesion: 0.13
Nodes (15): AllowanceCharge, InvoiceBill, InvoiceBillingPeriod, InvoiceCompany, InvoiceCustomer, InvoiceDetailResponse, InvoiceDian, InvoiceEstablishment (+7 more)

### Community 38 - "usePurchaseOrders.ts"
Cohesion: 0.07
Nodes (31): InternalPurchaseOrderDetailPage(), InternalPurchaseOrdersPage(), EditPurchaseOrderPage(), PurchaseOrderDetailPage(), PurchaseOrdersPage(), NewPurchaseOrderForm(), toDateInput(), toDateStr() (+23 more)

### Community 39 - "errors.ts"
Cohesion: 0.13
Nodes (21): ActivateAccountPage(), ConfirmEmailPage(), ResetPasswordPage(), AuthLinkStatus(), AuthLinkStatusProps, PasswordResetForm(), InvoiceStats, StatCard() (+13 more)

### Community 40 - "NewCertificateForm.tsx"
Cohesion: 0.06
Nodes (38): MODULES, PermissionGroupCard(), RolePermissionsPage(), NewCertificateForm(), NewCertificateFormProps, ApiKeysTab(), CreateApiKeyModal(), CreateApiKeyModalProps (+30 more)

### Community 41 - "returns/[id]/page.tsx"
Cohesion: 0.20
Nodes (11): PaymentDetailTotal(), PaymentDetailTotalProps, ReturnDetailDocument(), ReturnDetailDocumentProps, ReturnDetailHeader(), ReturnDetailSkeleton(), ReturnDetailSummary(), ReturnDetailSummaryProps (+3 more)

### Community 42 - "showToast"
Cohesion: 0.09
Nodes (34): CostCentersPage(), EditInternalPurchaseOrderPage(), toDateInput(), NewInternalPurchaseOrderPage(), EditResolutionPage(), NewResolutionPage(), ResolutionsPage(), EditResolutionModal() (+26 more)

### Community 43 - "cn"
Cohesion: 0.07
Nodes (39): AccordionContent(), AccordionItem(), AccordionTrigger(), AlertDialogOverlay(), Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis() (+31 more)

### Community 44 - "PaymentTable.tsx"
Cohesion: 0.12
Nodes (20): PaymentsPage(), PaymentTable(), PaymentTableProps, SelectionState, ServerPagination, getPaymentColumns(), filterLabels, MOCK_BANK_ACCOUNTS (+12 more)

### Community 45 - "ContactAdvancedForm.tsx"
Cohesion: 0.14
Nodes (21): NewContactContent(), AddContactModalProps, ModalContent(), PrefilledContactData, ContactAccountingInfo(), ContactAdvancedForm(), ContactAdvancedFormProps, ContactBasicForm() (+13 more)

### Community 46 - "useInvoices.ts"
Cohesion: 0.29
Nodes (7): InvoiceEditPage(), INVOICE_KEY(), INVOICES_KEY, useInvoice(), usePrefetchInvoiceDetail(), useUpdateInvoice(), InvoiceListData

### Community 47 - "tasks/page.tsx"
Cohesion: 0.16
Nodes (10): NewTaskDrawer(), NewTaskDrawerProps, ASSIGNEE_OPTIONS, FILTER_TABS, PRIORITY_OPTIONS, STATUS_OPTIONS, TaskFiltersPopup(), TaskFiltersPopupProps (+2 more)

### Community 48 - "ItemTable.tsx"
Cohesion: 0.22
Nodes (9): ItemTable(), ItemTableProps, SelectionState, ServerPagination, getItemColumns(), ItemTableBody(), ItemTablePagination(), ItemTablePaginationProps (+1 more)

### Community 49 - "DropdownMenuItem"
Cohesion: 0.27
Nodes (8): AvatarInitials(), Contact, getColorFromName(), getInitials(), ContactFilterChipsProps, contactFilterOptions, filterLabels, DropdownMenuItem()

### Community 50 - "useCompanyProfile.ts"
Cohesion: 0.48
Nodes (4): useUpdateCompanyProfile(), CompanyProfileService, CompanyProfileUpdatePayload, CompanyProfileUpdateResponse

### Community 51 - "carousel.tsx"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 53 - "InvoiceTable.tsx"
Cohesion: 0.14
Nodes (17): InvoiceTable(), InvoiceTableProps, ServerPagination, getColumns(), FilterChips(), FilterChipsProps, filterValueToColumnId, InvoiceTableBody() (+9 more)

### Community 54 - "CostCenterFilter.tsx"
Cohesion: 0.27
Nodes (7): CostCenterFilter(), CostCenterFilterProps, defaultCostCenterFilterOptions, FilterOption, FilterChipsProps, filterIcons, filterLabels

### Community 55 - "ItemDocumentsTab.tsx"
Cohesion: 0.32
Nodes (11): formatMoney(), getClientName(), getDocDate(), getDocNumber(), getDocStatus(), getDocTotal(), ItemDocumentsTab(), resolveDoc() (+3 more)

### Community 56 - "ResolutionForm.tsx"
Cohesion: 0.20
Nodes (14): baseSchema, formSchema, ResolutionFormProps, FormControl(), FormDescription(), FormField(), FormFieldContext, FormFieldContextValue (+6 more)

### Community 57 - "Extraction Subagent Prompt Template"
Cohesion: 0.18
Nodes (11): Confidence Score Rubric (EXTRACTED/INFERRED/AMBIGUOUS), extraction-spec.md Reference Guide, Hyperedge Extraction Rule, Node ID Format Spec ({stem}_{entity}), semantically_similar_to Edge Rule, Extraction Subagent Prompt Template, Honesty Rules, Part A: Structural (AST) extraction (+3 more)

### Community 58 - "CalculationService (Backend)"
Cohesion: 0.42
Nodes (11): CalculationService (Backend), Rationale: Frontend Must Not Send Monetary Amounts, credit_note_reference_index field, POST /api/credit-notes endpoint, POST /api/credit-notes/send endpoint, Tipo 1: Devolución Parcial (Ajuste de Cantidad), Tipo 2: Anulación Completa de la Factura, Tipo 3 y 6: Rebaja / Descuento a Líneas (+3 more)

### Community 59 - "menubar.tsx"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 60 - "extractErrorMessage"
Cohesion: 0.31
Nodes (6): ForgotPasswordPage(), ChangePasswordDialog(), PasswordGateDialog(), useChangePassword(), extractErrorMessage(), ChangePasswordPayload

### Community 61 - "Sidebar.tsx"
Cohesion: 0.19
Nodes (11): Logo(), CollapseButton(), MenuItem(), MenuItemProps, Sidebar(), SidebarMenuItem, SidebarMenuItems(), SidebarProps (+3 more)

### Community 62 - "PaymentDetailTabs.tsx"
Cohesion: 0.31
Nodes (5): PaymentDetailAccounting(), PaymentDetailAccountingAccounts(), PaymentDetailAccountingAccountsProps, PaymentDetailAdvances(), PaymentDetailTabsProps

### Community 63 - "auth-context.tsx"
Cohesion: 0.14
Nodes (16): CompanyProfilePage(), AuthenticatedLayout(), LoginPage(), RootPage(), Header(), SplashScreen(), SplashScreenProps, UserMenu() (+8 more)

### Community 64 - "ui/utils.ts"
Cohesion: 0.09
Nodes (14): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle(), HoverCardContent(), ResizableHandle() (+6 more)

### Community 65 - "invoices/page.tsx"
Cohesion: 0.50
Nodes (4): FacturasVentaViewProps, InvoicesPage(), InvoicePageHeader(), useInvoicesList()

### Community 66 - "exports.md Reference Guide"
Cohesion: 0.22
Nodes (9): Token reduction benchmark (Step 8), --falkordb / --falkordb-push export (Step 7a), --graphml export (Step 7c), exports.md Reference Guide, --mcp MCP stdio server (Step 7d), --neo4j / --neo4j-push export (Step 7), --svg export (Step 7b), --wiki export (Step 6b) (+1 more)

### Community 67 - "ReportsSections.tsx"
Cohesion: 0.33
Nodes (5): CategoryCard(), CategoryCardProps, ReportsCategoryGrid(), ReportsHeader(), ReportsSearchBar()

### Community 68 - "ProfileService"
Cohesion: 0.16
Nodes (13): SecurityPage(), ConnectedDevicesSection(), formatRelativeTime(), TwoFactorPanel(), TwoFactorSection(), Skeleton(), useDevices(), useProfile() (+5 more)

### Community 69 - "NewReturnForm"
Cohesion: 0.32
Nodes (3): NewReturnForm(), createEmptyLine(), NewReturnForm()

### Community 70 - "chart.tsx"
Cohesion: 0.14
Nodes (18): DistribucionGastosWidget(), DistribucionGastosWidgetProps, GastoItem, ClienteItem, MejoresClientesWidget(), MejoresClientesWidgetProps, ProductoItem, ProductosMasVendidosWidget() (+10 more)

### Community 71 - "TwoFactorPanel.tsx"
Cohesion: 0.09
Nodes (21): RecoveryCodesDisplay(), RecoveryCodesDisplayProps, CodeMode, ENABLE_STEP_PROGRESS, OTP_SLOTS, Step, TwoFactorPanelProps, InputOTP() (+13 more)

### Community 72 - "--update / --cluster-only subcommands (SKILL.md pointer)"
Cohesion: 0.29
Nodes (7): /graphify add <url>, add-watch.md Reference Guide, --watch (background folder watcher), /graphify add and --watch flow (SKILL.md pointer), Interpreter guard for subcommands, /graphify query flow (SKILL.md pointer), --update / --cluster-only subcommands (SKILL.md pointer)

### Community 73 - "Órdenes de compra: separación Ingresos (externas) vs Gastos (internas)"
Cohesion: 0.18
Nodes (10): Asociar una orden de compra externa a una factura, Contexto: dos tipos de "orden de compra" que NO deben confundirse, Contrato de API, Crear orden de compra — `POST /api/purchase-orders`, El formulario: reutilizar el de Gastos → Órdenes de compra, con un cambio, Listar — `GET /api/purchase-orders`, Qué agregar: nuevo ítem en el menú de Ingresos, Resumen de lo que hay que construir (+2 more)

### Community 74 - "CompanyProfileForm.tsx"
Cohesion: 0.14
Nodes (18): PasswordResetFormProps, TwoFactorChallengeForm(), TwoFactorChallengeFormProps, CompanyProfileForm(), getInitials(), Field(), FieldContent(), FieldDescription() (+10 more)

### Community 75 - "ItemDetailView.tsx"
Cohesion: 0.32
Nodes (7): formatMoney(), getItemTypeName(), InfoChip(), InfoField(), ItemDetailView(), StatusToggle(), TabButton()

### Community 76 - "/graphify Full Pipeline"
Cohesion: 0.29
Nodes (7): graphify Skill Auto-Trigger Rule, /graphify Full Pipeline, Step 1: Ensure graphify is installed, Step 2: Detect files, Step 5: Label communities, Step 6: Generate Obsidian vault + HTML, Step 9: Save manifest, update cost tracker, clean up, report

### Community 77 - "graphify Knowledge Graph System"
Cohesion: 0.29
Nodes (7): GRAPH_REPORT.md, graphify Knowledge Graph System, graphify explain command, graphify path command, graphify query command, graphify update command, graphify-out/wiki/index.md

### Community 78 - "query.md Reference Guide"
Cohesion: 0.52
Nodes (7): graphify explain "NODE_NAME", query.md Reference Guide, graphify path "A" "B", graphify query "<question>", graphify reflect / LESSONS.md, graphify save-result (work memory), Constrained Query Expansion (Step 0)

### Community 79 - "NewReturnForm.tsx"
Cohesion: 0.29
Nodes (6): ChangeClientModal(), ChangeTypeModal(), ExitFormModal(), AddedLine, FieldError, SelectedInvoice

### Community 80 - "ReturnsTableBody.tsx"
Cohesion: 0.14
Nodes (13): FilterOption, RETURN_FILTER_OPTIONS, ReturnsFilterChips(), ReturnsFilterChipsProps, ReturnsTable(), ReturnsTableProps, ReturnRow(), ReturnsTableBody() (+5 more)

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

### Community 86 - "CompanySummaryCard.tsx"
Cohesion: 0.31
Nodes (5): CompanySummaryCard(), ConfigCard(), ConfigCardProps, ConfigLink, ConfigurationGrid()

### Community 87 - "ItemFilterChips.tsx"
Cohesion: 0.33
Nodes (5): filterLabels, ItemFilterChips(), ItemFilterChipsProps, itemFilterOptions, MOCK_WAREHOUSES

### Community 88 - "FlujoTransaccionesWidget.tsx"
Cohesion: 0.50
Nodes (3): FlujoTransaccionesData, FlujoTransaccionesWidget(), FlujoTransaccionesWidgetProps

### Community 89 - "github-and-merge.md Reference Guide"
Cohesion: 0.60
Nodes (5): graphify clone <github-url>, github-and-merge.md Reference Guide, graphify merge-graphs, Monorepo / multi-subfolder merge flow, Step 0: GitHub repos and multi-path merge

### Community 90 - "AddGraphMenu.tsx"
Cohesion: 0.40
Nodes (4): AddGraphMenu(), AddGraphMenuProps, allGraphOptions, GraphOption

### Community 91 - "ContactDetailGeneral.tsx"
Cohesion: 0.47
Nodes (4): ContactDetailGeneral(), ContactDetailGeneralProps, RadioGroup(), RadioGroupItem()

### Community 92 - "TotalVentasWidget.tsx"
Cohesion: 0.50
Nodes (3): TotalVentasWidget(), TotalVentasWidgetProps, VentasData

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

### Community 100 - "users/page.tsx"
Cohesion: 0.83
Nodes (3): getInitials(), UsersPage(), VALID_ROLES

### Community 103 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 113 - "alert.tsx"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 121 - "PersonalDataSection.tsx"
Cohesion: 0.29
Nodes (6): getInitials(), isTenantProfile(), PersonalDataSection(), useUpdateProfile(), ProfileTenant, UpdateProfilePayload

### Community 123 - "dependencies"
Cohesion: 0.13
Nodes (15): cmdk, date-fns, @dnd-kit/core, @dnd-kit/sortable, dependencies, cmdk, date-fns, @dnd-kit/core (+7 more)

### Community 141 - "Header.tsx"
Cohesion: 0.15
Nodes (16): Factucore Horizontal Logo, HeaderProps, SolutionsPopover(), SolutionsPopoverProps, Command(), CommandDialog(), CommandEmpty(), CommandGroup() (+8 more)

## Knowledge Gaps
- **617 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+612 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **84 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `table.tsx`, `AdvancedOptionsSection.tsx`, `dialog.tsx`, `NewRemissionMain.tsx`, `payments/[id]/page.tsx`, `sidebar.tsx`, `remissions/[id]/edit/page.tsx`, `quote.ts`, `items/page.tsx`, `CustomToaster.tsx`, `CreditNotesService`, `contacts/page.tsx`, `CostCenterTable.tsx`, `cn`, `useCatalogs`, `useQuotes.ts`, `invoices/[id]/page.tsx`, `remission.ts`, `invoice/table/FilterChips.tsx`, `items/[id]/page.tsx`, `usePurchaseOrders.ts`, `NewCertificateForm.tsx`, `showToast`, `cn`, `PaymentTable.tsx`, `ItemTable.tsx`, `carousel.tsx`, `InvoiceTable.tsx`, `ItemDocumentsTab.tsx`, `ResolutionForm.tsx`, `Sidebar.tsx`, `ui/utils.ts`, `invoices/page.tsx`, `chart.tsx`, `TwoFactorPanel.tsx`, `ItemDetailView.tsx`, `ReturnsTableBody.tsx`, `SoftwareList.tsx`, `ItemFilterChips.tsx`, `dependencies`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **Why does `showToast()` connect `showToast` to `table.tsx`, `AdvancedOptionsSection.tsx`, `dialog.tsx`, `types/auth.ts`, `NewRemissionMain.tsx`, `tooltip.tsx`, `payments/[id]/page.tsx`, `remissions/[id]/edit/page.tsx`, `quote.ts`, `ApiResponse`, `dashboard/page.tsx`, `AuthService`, `button.tsx`, `useNotifications.ts`, `items/page.tsx`, `CustomToaster.tsx`, `CreditNotesService`, `cn`, `lib/items.ts`, `contacts/[id]/page.tsx`, `react`, `useCatalogs`, `InvoicesService`, `useQuotes.ts`, `invoices/[id]/page.tsx`, `usePurchaseOrders.ts`, `errors.ts`, `NewCertificateForm.tsx`, `returns/[id]/page.tsx`, `PaymentTable.tsx`, `ContactAdvancedForm.tsx`, `useCompanyProfile.ts`, `ResolutionForm.tsx`, `extractErrorMessage`, `Sidebar.tsx`, `auth-context.tsx`, `ProfileService`, `NewReturnForm`, `TwoFactorPanel.tsx`, `NewReturnForm.tsx`, `PersonalDataSection.tsx`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `next-themes`, `@hookform/resolvers`, `html2canvas`, `input-otp`, `next`, `react-hook-form`, `radix-ui`, `clsx`, `@radix-ui/react-checkbox`, `@radix-ui/react-label`, `devDependencies`, `lucide-react`, `pusher-js`, `jspdf`, `@radix-ui/react-progress`, `laravel-echo`, `@radix-ui/react-tabs`, `@radix-ui/react-accordion`, `postcss`, `@radix-ui/react-toggle-group`, `react-dom`, `react-qr-code`, `@radix-ui/react-alert-dialog`, `react-resizable-panels`, `@radix-ui/react-aspect-ratio`, `react`, `@radix-ui/react-avatar`, `sonner`, `@radix-ui/react-dialog`, `tailwind-merge`, `@radix-ui/react-dropdown-menu`, `@tanstack/query-sync-storage-persister`, `@radix-ui/react-context-menu`, `@tanstack/react-query-persist-client`, `vaul`, `axios`, `@radix-ui/react-menubar`, `@radix-ui/react-hover-card`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-radio-group`, `@radix-ui/react-slot`, `@radix-ui/react-select`, `@radix-ui/react-toggle`, `@radix-ui/react-separator`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@tabler/icons-react`, `class-variance-authority`, `react-day-picker`, `recharts`, `tailwindcss-animate`, `@tanstack/react-query`, `zod`, `dayjs`, `geist`, `@dnd-kit/modifiers`, `@dnd-kit/utilities`, `embla-carousel-react`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _617 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `table.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09951690821256039 - nodes in this community are weakly interconnected._
- **Should `dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07515734912995187 - nodes in this community are weakly interconnected._
- **Should `types/auth.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11954022988505747 - nodes in this community are weakly interconnected._