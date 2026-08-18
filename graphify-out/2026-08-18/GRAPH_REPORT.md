# Graph Report - facturacion-cliente  (2026-08-18)

## Corpus Check
- 545 files · ~297,062 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2519 nodes · 7504 edges · 208 communities (130 shown, 78 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `21bd8734`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- table.tsx
- TotalVentasWidget.tsx
- dialog.tsx
- types/auth.ts
- types/catalogs.ts
- NewRemissionMain.tsx
- invoice/table/columns.tsx
- PaymentsService
- sidebar.tsx
- remissions/new/page.tsx
- QuoteTable.tsx
- react
- dashboard/page.tsx
- AuthService
- dropdown-menu.tsx
- devDependencies
- useNotifications.ts
- compilerOptions
- QuickCreateItemModal.tsx
- types/items.ts
- cn
- components.json
- CreditNotesService
- debounced-input.tsx
- UserInfoPanel.tsx
- CommentsAndReminders.tsx
- lib/items.ts
- contacts/[id]/page.tsx
- Comentarios con @mentions + Notificaciones en tiempo real
- AdvancedOptionsSection.tsx
- quotes/[id]/edit/page.tsx
- InvoicesService
- quote.ts
- invoices/[id]/page.tsx
- RemissionTable.tsx
- contacts/page.tsx
- ItemResponse
- invoice.ts
- purchaseOrder.ts
- activate-account/page.tsx
- IntegrationsService
- payments/[id]/page.tsx
- ApiClient
- drawer.tsx
- PaymentTable.tsx
- tooltip.tsx
- useInvoices.ts
- tasks/page.tsx
- ItemTable.tsx
- usePurchaseOrders.ts
- CompanyProfileForm.tsx
- carousel.tsx
- cn
- InvoiceTable.tsx
- ApiResponse
- ItemDocumentsTab.tsx
- form.tsx
- Extraction Subagent Prompt Template
- CalculationService (Backend)
- menubar.tsx
- items/[id]/page.tsx
- Sidebar.tsx
- PaymentDetailTabs.tsx
- auth-context.tsx
- ui/utils.ts
- remission.ts
- exports.md Reference Guide
- ReportsSections.tsx
- PersonalDataSection.tsx
- ResolutionTable.tsx
- chart.tsx
- TwoFactorPanel.tsx
- --update / --cluster-only subcommands (SKILL.md pointer)
- Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales
- field.tsx
- pagination.tsx
- /graphify Full Pipeline
- graphify Knowledge Graph System
- query.md Reference Guide
- items/page.tsx
- formatCurrency
- package.json
- tenant.ts
- update.md Reference Guide
- widget.interface.ts
- returns/[id]/page.tsx
- Ajuste de flujo: emisión de facturas y notas crédito ahora es asíncrona
- softwares.ts
- remissions.ts
- github-and-merge.md Reference Guide
- AddGraphMenu.tsx
- useResolutions
- ItemDetailView.tsx
- catalogCache.ts
- hooks.md Reference Guide
- transcribe.md Reference Guide
- Next.js Project (create-next-app bootstrap)
- contact/table/columns.tsx
- ContactDetailGeneral.tsx
- CuentasPorPagarWidget.tsx
- [role]/page.tsx
- invoice/InvoiceItemsTable.tsx
- context-menu.tsx
- [filename]/page.tsx
- next.config.ts
- contacts/layout.tsx
- dashboard/layout.tsx
- invoices/layout.tsx
- invoices/new/layout.tsx
- items/layout.tsx
- payments/new/layout.tsx
- payments/page.tsx
- EmptyStateWidget.tsx
- dayjs
- DocumentTitleUpdater.tsx
- Loader.tsx
- proxy.ts
- resolveStockFields
- RemissionDetailHeader.tsx
- PasswordGateDialog.tsx
- geist
- dependencies
- @dnd-kit/modifiers
- showToast
- @dnd-kit/utilities
- embla-carousel-react
- eslint.config.mjs
- next-themes
- @hookform/resolvers
- html2canvas
- input-otp
- ChangeEmailDialog.tsx
- next
- react-hook-form
- radix-ui
- alert.tsx
- clsx
- @radix-ui/react-checkbox
- users/page.tsx
- searchable-select.tsx
- @radix-ui/react-label
- @radix-ui/react-progress
- MonthSelector.tsx
- CuentasPorCobrarWidget.tsx
- jspdf
- @radix-ui/react-tabs
- laravel-echo
- @radix-ui/react-toggle-group
- FlujoTransaccionesWidget.tsx
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
- NewInvoiceView.tsx
- @tanstack/react-query-persist-client
- DeleteWidgetDialog.tsx
- vaul
- @radix-ui/react-context-menu
- postcss.config.mjs
- afleones (User/Author Persona)
- globals.css.d.ts
- global.d.ts
- newInvoiceMockData.ts
- FactuCore Logo
- Login Page Illustration (Facturación Electrónica)
- EmptyDashboardState.tsx
- @radix-ui/react-hover-card
- @radix-ui/react-navigation-menu
- @radix-ui/react-radio-group
- ClientesConVentasWidget.tsx
- @radix-ui/react-select
- DevolucionesWidget.tsx
- @radix-ui/react-separator
- @radix-ui/react-slider
- @radix-ui/react-switch
- @tabler/icons-react
- class-variance-authority
- ImpuestosWidget.tsx
- ProductosVendidosSimpleWidget.tsx
- PaymentFilterChips.tsx
- WidgetSkeleton.tsx
- cmdk
- @dnd-kit/core
- @dnd-kit/sortable
- @radix-ui/react-collapsible
- @radix-ui/react-tooltip
- @tanstack/react-table
- button.tsx
- date-fns

## God Nodes (most connected - your core abstractions)
1. `showToast()` - 219 edges
2. `cn()` - 198 edges
3. `cn()` - 141 edges
4. `react` - 118 edges
5. `Button()` - 113 edges
6. `useCatalogs()` - 55 edges
7. `ApiResponse` - 55 edges
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
  src/app/(authenticated)/expenses/purchase-orders/page.tsx → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Modular Reference-Doc Loading Pattern** — claude_skills_graphify_skill_step0_github_merge, claude_skills_graphify_skill_step2_5_transcribe, claude_skills_graphify_skill_part_b_semantic_extraction, claude_skills_graphify_skill_update_cluster_only, claude_skills_graphify_skill_query_flow, claude_skills_graphify_skill_add_watch_flow, claude_skills_graphify_skill_hooks_integration, claude_skills_graphify_skill_exports_flow [INFERRED 0.85]
- **Self-Improving Query Feedback Loop (save-result + reflect)** — claude_skills_graphify_references_query_query_command, claude_skills_graphify_references_query_path_command, claude_skills_graphify_references_query_explain_command, claude_skills_graphify_references_query_save_result_command, claude_skills_graphify_references_query_reflect_command [EXTRACTED 1.00]
- **Incremental Update Manifest & Merge Integrity Guards** — claude_skills_graphify_references_update_update_flag, claude_skills_graphify_references_update_build_merge_function, claude_skills_graphify_skill_step9_cleanup_report [INFERRED 0.75]
- **Credit Note Types Using Line-Level Adjustments with CalculationService** — payload_examples_type1, payload_examples_type3, payload_examples_type4, payload_examples_type5, payload_examples_calculation_service [INFERRED 0.85]
- **graphify CLI Subcommands** — claude_md_graphify_query, claude_md_graphify_path, claude_md_graphify_explain, claude_md_graphify_update [EXTRACTED 1.00]

## Communities (208 total, 78 thin omitted)

### Community 0 - "table.tsx"
Cohesion: 0.06
Nodes (54): FactucoreLogo(), FactucoreLogoProps, CertificateListProps, CompanySummaryCard(), ConfigCard(), ConfigCardProps, ConfigLink, ConfigurationGrid() (+46 more)

### Community 1 - "TotalVentasWidget.tsx"
Cohesion: 0.50
Nodes (3): TotalVentasWidget(), TotalVentasWidgetProps, VentasData

### Community 2 - "dialog.tsx"
Cohesion: 0.08
Nodes (36): AttributeModalProps, ConfigCostCentersModalProps, DOCUMENT_TYPES, ProductGalleryModalProps, CreateWarehouseModal(), CreateWarehouseModalProps, ProductComboModalProps, VariantGalleryModalProps (+28 more)

### Community 3 - "types/auth.ts"
Cohesion: 0.20
Nodes (15): ChangeEmailPayload, ChangePasswordPayload, DeviceSession, LoginRequires2FA, ProfileMaster, ProfileResponse, RecoveryCodesRegeneratePayload, RecoveryCodesResponse (+7 more)

### Community 4 - "types/catalogs.ts"
Cohesion: 0.12
Nodes (15): Attribute, Category, Country, CustomField, Department, Municipality, Plan, PriceList (+7 more)

### Community 5 - "NewRemissionMain.tsx"
Cohesion: 0.15
Nodes (31): AddContactModal(), EditResolutionModal(), InvoiceItemsTable(), NewPaymentTermModal(), OtherIncomeTable(), OtherIncomeTableProps, QuoteItemsTable(), QuoteExportModalProps (+23 more)

### Community 6 - "invoice/table/columns.tsx"
Cohesion: 0.18
Nodes (17): NewCertificateFormProps, InvoiceDetailHeaderProps, contactLabel(), PurchaseOrderDetailView(), contactLabel(), InternalPurchaseOrderDetailView(), PurchaseOrderStatusBadge(), NewSoftwareFormProps (+9 more)

### Community 7 - "PaymentsService"
Cohesion: 0.28
Nodes (4): PaymentDetailPage(), NewPaymentPageContent(), usePayment(), PaymentsService

### Community 8 - "sidebar.tsx"
Cohesion: 0.08
Nodes (28): Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+20 more)

### Community 9 - "remissions/new/page.tsx"
Cohesion: 0.10
Nodes (27): EditRemissionPage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), RemissionDetailPage(), NewRemissionPageContent(), NewRemissionFooter(), NewRemissionHeader(), NewRemissionHeaderProps (+19 more)

### Community 10 - "QuoteTable.tsx"
Cohesion: 0.13
Nodes (20): FacturasVentaViewProps, QuotesPage(), FacturasVentaViewProps, QuotesPage(), QuoteExportModal(), QuoteFilter(), QuotePageHeader(), QuotePageHeaderProps (+12 more)

### Community 11 - "react"
Cohesion: 0.13
Nodes (14): react, react, ConfigCostCentersModal(), FormattedInput(), NewInvoiceComments(), FormattedInput(), FormattedInput(), FormattedInput() (+6 more)

### Community 12 - "dashboard/page.tsx"
Cohesion: 0.18
Nodes (16): DashboardPage(), isPredefinedWidget(), PREDEFINED_POSITIONS, SortableWidgetProps, Widget, clientesConVentasMock, cuentasPorCobrarMock, cuentasPorPagarMock (+8 more)

### Community 13 - "AuthService"
Cohesion: 0.11
Nodes (12): AccountSwitcher(), AccountSwitcherProps, HelpCenterPopover(), HelpCenterPopoverProps, NewPaymentForm(), RemissionDetailDocument(), RemissionDetailExtraInfo(), RemissionDetailExtraInfoProps (+4 more)

### Community 14 - "dropdown-menu.tsx"
Cohesion: 0.06
Nodes (48): Factucore Horizontal Logo, ContactDetailHeaderProps, contactFilterOptions, filterLabels, CostCenterFilterProps, FilterOption, Header(), HeaderProps (+40 more)

### Community 15 - "devDependencies"
Cohesion: 0.09
Nodes (23): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, shadcn (+15 more)

### Community 16 - "useNotifications.ts"
Cohesion: 0.10
Nodes (22): metadata, DOCUMENT_ROUTES, NotificationBell(), timeAgo(), CustomToaster(), ThemeProvider(), getChannelName(), LIST_KEY() (+14 more)

### Community 17 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 18 - "QuickCreateItemModal.tsx"
Cohesion: 0.09
Nodes (31): ItemImage, CategoryModalProps, NewCategoryModal(), CustomFieldModal(), BLANK_BASIC, QuickCreateItemModal(), QuickCreateItemModalProps, AccountingSection() (+23 more)

### Community 19 - "types/items.ts"
Cohesion: 0.08
Nodes (30): Image, BaseItemBasicInfo, BaseItemPayload, ComboBasicInfo, ComboItemPayload, CreateItemAccounting, CreateItemComboComponent, CreateItemComboSettings (+22 more)

### Community 20 - "cn"
Cohesion: 0.17
Nodes (23): CostCenter, NewCostCenterModal(), NewCostCenterModalProps, CreateCurrencyModalProps, NewCurrencyModal(), NewPriceListModal(), NewPriceListModalProps, FixedFields (+15 more)

### Community 21 - "components.json"
Cohesion: 0.08
Nodes (23): aliases, components, hooks, lib, ui, utils, Authorization, iconLibrary (+15 more)

### Community 22 - "CreditNotesService"
Cohesion: 0.11
Nodes (12): ReturnDetailPage(), NewReturnForm(), createEmptyLine(), NewReturnForm(), CREDIT_NOTE_KEY(), CREDIT_NOTES_KEY, extractCreditNote(), useCreditNote() (+4 more)

### Community 23 - "debounced-input.tsx"
Cohesion: 0.16
Nodes (12): ItemsPage(), ReturnsPage(), ReturnPageHeader(), ReturnsTable(), ReturnsTableProps, ReturnsTableBody(), ReturnsTablePagination(), ReturnsTablePaginationProps (+4 more)

### Community 24 - "UserInfoPanel.tsx"
Cohesion: 0.19
Nodes (10): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), UserInfoPanel() (+2 more)

### Community 25 - "CommentsAndReminders.tsx"
Cohesion: 0.13
Nodes (25): PaymentTabs(), CommentEditor(), ConnectedCommentsAndReminders(), formatTime(), initialsOf(), LegacyCommentsAndReminders(), MentionResults(), stripHtml() (+17 more)

### Community 26 - "lib/items.ts"
Cohesion: 0.19
Nodes (10): EditItemPage(), UseItemsParams, useItemById(), useUpdateItem(), itemsApi, PaginatedData, GetItemByIdResponse, ItemsListApiData (+2 more)

### Community 27 - "contacts/[id]/page.tsx"
Cohesion: 0.17
Nodes (11): ContactDetailPage(), ContactDetailAttachments(), ContactDetailAttachmentsProps, ContactDetailBranches(), ContactDetailBranchesProps, ContactDetailComments(), ContactDetailCommentsProps, ContactDetailHeader() (+3 more)

### Community 28 - "Comentarios con @mentions + Notificaciones en tiempo real"
Cohesion: 0.07
Nodes (26): API — Comentarios, API — Notificaciones, Arquitectura, Campanita del navbar/header, Comentarios con @mentions + Notificaciones en tiempo real, `DELETE /v1/comments/{id}`, Despliegue en Railway — servicio nuevo `factucore_websockets`, Editar un comentario (+18 more)

### Community 29 - "AdvancedOptionsSection.tsx"
Cohesion: 0.16
Nodes (14): AttributeModal(), ComboProductEntry, PriceListEntry, WarehouseEntry, GeneralInfoSectionProps, ItemType, ComboProductData, ProductComboModal() (+6 more)

### Community 30 - "quotes/[id]/edit/page.tsx"
Cohesion: 0.13
Nodes (22): EditQuotePage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), NewQuotePageContent(), PreviewModal(), PreviewModalProps, NewQuoteFooter(), NewQuoteHeader() (+14 more)

### Community 31 - "InvoicesService"
Cohesion: 0.20
Nodes (3): InvoiceDetailPage(), InvoicesService, Invoice

### Community 32 - "quote.ts"
Cohesion: 0.07
Nodes (30): QuoteDetailPage(), QuoteDetailExtraInfo(), QuoteDetailExtraInfoProps, QuoteDetailSkeleton(), QuoteDetailSummary(), QuoteDetailSummaryProps, INVOICE_KEY(), INVOICES_KEY (+22 more)

### Community 33 - "invoices/[id]/page.tsx"
Cohesion: 0.14
Nodes (10): InvoiceDetailDocument(), InvoiceDetailExtraInfo(), InvoiceDetailExtraInfoProps, InvoiceDetailHeader(), InvoiceDetailSkeleton(), InvoiceDetailSummary(), InvoiceDetailSummaryProps, InvoiceDetailTabs() (+2 more)

### Community 34 - "RemissionTable.tsx"
Cohesion: 0.12
Nodes (19): FacturasVentaViewProps, RemissionsPage(), RemissionFilter(), RemissionTable(), RemissionTableProps, ServerPagination, getColumns(), FilterChips() (+11 more)

### Community 35 - "contacts/page.tsx"
Cohesion: 0.14
Nodes (16): Contact, ContactPage(), ContactType, Contact, ContactTable(), ContactTableProps, SelectionState, ServerPagination (+8 more)

### Community 36 - "ItemResponse"
Cohesion: 0.18
Nodes (10): TabConfig, ItemHeaderProps, InfoChip(), ItemMainInfo(), ItemMainInfoProps, ItemPriceLists(), ItemPriceListsProps, ProductGalleryModal() (+2 more)

### Community 37 - "invoice.ts"
Cohesion: 0.12
Nodes (16): AllowanceCharge, DianSubmissionStatus, InvoiceBill, InvoiceBillingPeriod, InvoiceCompany, InvoiceCustomer, InvoiceDetailResponse, InvoiceDian (+8 more)

### Community 38 - "purchaseOrder.ts"
Cohesion: 0.12
Nodes (20): InternalPurchaseOrdersPage(), PurchaseOrdersPage(), PurchaseOrderPageHeader(), PurchaseOrderTable(), PurchaseOrderTableProps, ServerPagination, getColumns(), PurchaseOrderTableBody() (+12 more)

### Community 39 - "activate-account/page.tsx"
Cohesion: 0.15
Nodes (12): ActivateAccountContent(), ConfirmEmailContent(), ResetPasswordContent(), AuthLinkStatus(), AuthLinkStatusProps, LogoHorizontal(), AuthFlowService, ConfirmEmailPayload (+4 more)

### Community 40 - "IntegrationsService"
Cohesion: 0.10
Nodes (18): ApiKeysTab(), CreateApiKeyModal(), CreateApiKeyModalProps, CreateWebhookModal(), RotateSecretModal(), RotateSecretModalProps, WebhookDeliveriesModal(), WebhookDeliveriesModalProps (+10 more)

### Community 41 - "payments/[id]/page.tsx"
Cohesion: 0.19
Nodes (9): Attachment, PaymentDetailAttachments(), PaymentDetailAttachmentsProps, PaymentDetailHeader(), PaymentDetailInfo(), PaymentDetailInfoProps, PaymentDetailTotal(), PaymentDetailTotalProps (+1 more)

### Community 42 - "ApiClient"
Cohesion: 0.11
Nodes (7): CONTACTS_KEY, ApiClient, AttributePayload, attributesApi, categoriesApi, currenciesApi, priceListsApi

### Community 43 - "drawer.tsx"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 44 - "PaymentTable.tsx"
Cohesion: 0.16
Nodes (12): PaymentTable(), SelectionState, ServerPagination, getPaymentColumns(), PaymentTableBody(), PaymentTablePagination(), PaymentTablePaginationProps, ServerPagination (+4 more)

### Community 45 - "tooltip.tsx"
Cohesion: 0.08
Nodes (36): NewContactContent(), AddContactModalProps, ModalContent(), PrefilledContactData, ContactAccountingInfo(), ContactAccountingInfoProps, ContactAdvancedForm(), ContactAdvancedFormProps (+28 more)

### Community 46 - "useInvoices.ts"
Cohesion: 0.25
Nodes (9): InvoiceEditPage(), extractInvoiceFromDetail(), INVOICE_KEY(), INVOICES_KEY, useInvoice(), usePrefetchInvoiceDetail(), useSendInvoice(), useUpdateInvoice() (+1 more)

### Community 47 - "tasks/page.tsx"
Cohesion: 0.16
Nodes (10): NewTaskDrawer(), NewTaskDrawerProps, ASSIGNEE_OPTIONS, FILTER_TABS, PRIORITY_OPTIONS, STATUS_OPTIONS, TaskFiltersPopup(), TaskFiltersPopupProps (+2 more)

### Community 48 - "ItemTable.tsx"
Cohesion: 0.09
Nodes (24): contactFilterOptions, ContactTableToolbarProps, FilterOption, InvoiceFilter(), ItemTable(), ItemTableProps, SelectionState, ServerPagination (+16 more)

### Community 49 - "usePurchaseOrders.ts"
Cohesion: 0.14
Nodes (13): InternalPurchaseOrderDetailPage(), EditPurchaseOrderPage(), PurchaseOrderDetailPage(), NewPurchaseOrderForm(), toDateInput(), toDateStr(), PURCHASE_ORDER_KEY(), PURCHASE_ORDERS_KEY (+5 more)

### Community 50 - "CompanyProfileForm.tsx"
Cohesion: 0.27
Nodes (7): CompanyProfileForm(), getInitials(), useUpdateCompanyProfile(), CompanyProfileService, extractFieldErrors(), CompanyProfileUpdatePayload, CompanyProfileUpdateResponse

### Community 51 - "carousel.tsx"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 52 - "cn"
Cohesion: 0.07
Nodes (36): AccordionContent(), AccordionItem(), AccordionTrigger(), AlertDialogOverlay(), Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis() (+28 more)

### Community 53 - "InvoiceTable.tsx"
Cohesion: 0.11
Nodes (22): FacturasVentaViewProps, InvoicesPage(), InvoicePageHeader(), InvoiceTable(), InvoiceTableProps, ServerPagination, getColumns(), FilterChips() (+14 more)

### Community 54 - "ApiResponse"
Cohesion: 0.15
Nodes (4): ActionsCell(), PaymentTermsService, SellersService, ApiResponse

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

### Community 59 - "menubar.tsx"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 60 - "items/[id]/page.tsx"
Cohesion: 0.17
Nodes (9): ItemDetailPage(), ItemAccounting(), ItemAttachments(), ItemHeader(), ItemInventory(), ItemInventoryProps, useDeleteItem(), ToggleStatusParams (+1 more)

### Community 61 - "Sidebar.tsx"
Cohesion: 0.19
Nodes (11): Logo(), CollapseButton(), MenuItem(), MenuItemProps, Sidebar(), SidebarMenuItem, SidebarMenuItems(), SidebarProps (+3 more)

### Community 62 - "PaymentDetailTabs.tsx"
Cohesion: 0.38
Nodes (4): PaymentDetailAccounting(), PaymentDetailAdvances(), PaymentDetailTabs(), PaymentDetailTabsProps

### Community 63 - "auth-context.tsx"
Cohesion: 0.12
Nodes (17): CompanyProfilePage(), AuthenticatedLayout(), LoginPage(), RootPage(), SplashScreen(), SplashScreenProps, UserMenu(), UserMenuProps (+9 more)

### Community 64 - "ui/utils.ts"
Cohesion: 0.12
Nodes (10): HoverCardContent(), Progress(), ResizableHandle(), ResizablePanelGroup(), Slider(), ToggleGroup(), ToggleGroupContext, ToggleGroupItem() (+2 more)

### Community 65 - "remission.ts"
Cohesion: 0.13
Nodes (14): AllowanceCharge, RemissionBill, RemissionBillingPeriod, RemissionCompany, RemissionCustomer, RemissionDetailResponse, RemissionDian, RemissionEstablishment (+6 more)

### Community 66 - "exports.md Reference Guide"
Cohesion: 0.22
Nodes (9): Token reduction benchmark (Step 8), --falkordb / --falkordb-push export (Step 7a), --graphml export (Step 7c), exports.md Reference Guide, --mcp MCP stdio server (Step 7d), --neo4j / --neo4j-push export (Step 7), --svg export (Step 7b), --wiki export (Step 6b) (+1 more)

### Community 67 - "ReportsSections.tsx"
Cohesion: 0.33
Nodes (5): CategoryCard(), CategoryCardProps, ReportsCategoryGrid(), ReportsHeader(), ReportsSearchBar()

### Community 68 - "PersonalDataSection.tsx"
Cohesion: 0.13
Nodes (15): SecurityPage(), ConnectedDevicesSection(), formatRelativeTime(), getInitials(), isTenantProfile(), PersonalDataSection(), TwoFactorSection(), Skeleton() (+7 more)

### Community 69 - "ResolutionTable.tsx"
Cohesion: 0.18
Nodes (11): ResolutionTable(), ResolutionTableProps, ServerPagination, getResolutionColumns(), ResolutionFilterChips(), ResolutionTableBody(), ResolutionTablePagination(), ResolutionTablePaginationProps (+3 more)

### Community 70 - "chart.tsx"
Cohesion: 0.14
Nodes (18): DistribucionGastosWidget(), DistribucionGastosWidgetProps, GastoItem, ClienteItem, MejoresClientesWidget(), MejoresClientesWidgetProps, ProductoItem, ProductosMasVendidosWidget() (+10 more)

### Community 71 - "TwoFactorPanel.tsx"
Cohesion: 0.13
Nodes (16): ChangePasswordDialog(), ChangePasswordDialogProps, RecoveryCodesDisplay(), RecoveryCodesDisplayProps, CodeMode, ENABLE_STEP_PROGRESS, OTP_SLOTS, Step (+8 more)

### Community 72 - "--update / --cluster-only subcommands (SKILL.md pointer)"
Cohesion: 0.29
Nodes (7): /graphify add <url>, add-watch.md Reference Guide, --watch (background folder watcher), /graphify add and --watch flow (SKILL.md pointer), Interpreter guard for subcommands, /graphify query flow (SKILL.md pointer), --update / --cluster-only subcommands (SKILL.md pointer)

### Community 73 - "Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales"
Cohesion: 0.22
Nodes (8): Contrato de API actualizado, Edición (`PATCH /purchase-orders/{id}`), La respuesta ahora trae totales reales, Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales, Qué hay que agregar al formulario de items, Recapitulación: dos tipos de orden de compra (sigue igual), Resumen de lo que hay que construir/ajustar, Órdenes de compra: ajustes de descuentos, impuestos y cargos globales

### Community 74 - "field.tsx"
Cohesion: 0.10
Nodes (27): PasswordResetForm(), PasswordResetFormProps, TwoFactorChallengeForm(), TwoFactorChallengeFormProps, InvoiceStats, StatCard(), StatCardProps, Card() (+19 more)

### Community 75 - "pagination.tsx"
Cohesion: 0.22
Nodes (7): Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLink(), PaginationLinkProps, PaginationNext(), PaginationPrevious()

### Community 76 - "/graphify Full Pipeline"
Cohesion: 0.29
Nodes (7): graphify Skill Auto-Trigger Rule, /graphify Full Pipeline, Step 1: Ensure graphify is installed, Step 2: Detect files, Step 5: Label communities, Step 6: Generate Obsidian vault + HTML, Step 9: Save manifest, update cost tracker, clean up, report

### Community 77 - "graphify Knowledge Graph System"
Cohesion: 0.29
Nodes (7): GRAPH_REPORT.md, graphify Knowledge Graph System, graphify explain command, graphify path command, graphify query command, graphify update command, graphify-out/wiki/index.md

### Community 78 - "query.md Reference Guide"
Cohesion: 0.52
Nodes (7): graphify explain "NODE_NAME", query.md Reference Guide, graphify path "A" "B", graphify query "<question>", graphify reflect / LESSONS.md, graphify save-result (work memory), Constrained Query Expansion (Step 0)

### Community 79 - "items/page.tsx"
Cohesion: 0.26
Nodes (8): NewItemPage(), FormState, ExportConfig, ExportItemsModal(), ExportItemsModalProps, NewItemFormProps, useCreateItem(), CreateItemPayload

### Community 80 - "formatCurrency"
Cohesion: 0.15
Nodes (11): PaymentDetailAccountingAccounts(), PaymentDetailAccountingAccountsProps, ReturnDetailDocument(), ReturnDetailSummary(), ReturnDetailSummaryProps, ReturnDetailTabs(), ReturnDetailTabsProps, ReturnRow() (+3 more)

### Community 81 - "package.json"
Cohesion: 0.20
Nodes (9): name, packageManager, private, scripts, build, dev, lint, start (+1 more)

### Community 82 - "tenant.ts"
Cohesion: 0.29
Nodes (6): CreateTenantInput, createTenantSchema, Tenant, tenantSchema, UpdateTenantInput, updateTenantSchema

### Community 83 - "update.md Reference Guide"
Cohesion: 0.33
Nodes (6): build_merge() / graph_diff(), --cluster-only, update.md Reference Guide, --update (incremental re-extraction), Step 4.5: Graph health check, Step 4: Build graph, cluster, analyze, generate outputs

### Community 84 - "widget.interface.ts"
Cohesion: 0.33
Nodes (3): DashboardViewProps, SortableWidgetProps, Widget

### Community 85 - "returns/[id]/page.tsx"
Cohesion: 0.27
Nodes (6): ReturnDetailHeader(), ReturnDetailSkeleton(), DianSubmissionPendingCard(), DianSubmissionPendingCardProps, DianSubmissionStatus, useDianSubmissionPolling()

### Community 86 - "Ajuste de flujo: emisión de facturas y notas crédito ahora es asíncrona"
Cohesion: 0.29
Nodes (6): Ajuste de flujo: emisión de facturas y notas crédito ahora es asíncrona, Contexto, Ejemplo de polling (pseudocódigo, adaptar al stack del frontend), Qué debe hacer el frontend, Qué NO cambia, Qué se rompe con el flujo actual

### Community 87 - "softwares.ts"
Cohesion: 0.29
Nodes (6): SoftwarePage(), NewSoftwareModal(), SoftwareList(), CreateSoftwarePayload, SoftwareResponse, softwaresApi

### Community 88 - "remissions.ts"
Cohesion: 0.36
Nodes (5): DateRangeExportResult, exportByDateRange(), extractFilenameFromContentDisposition(), extractJsonMessage(), RemissionFindAllSuccess

### Community 89 - "github-and-merge.md Reference Guide"
Cohesion: 0.60
Nodes (5): graphify clone <github-url>, github-and-merge.md Reference Guide, graphify merge-graphs, Monorepo / multi-subfolder merge flow, Step 0: GitHub repos and multi-path merge

### Community 90 - "AddGraphMenu.tsx"
Cohesion: 0.40
Nodes (4): AddGraphMenu(), AddGraphMenuProps, allGraphOptions, GraphOption

### Community 91 - "useResolutions"
Cohesion: 0.15
Nodes (20): EditInternalPurchaseOrderPage(), toDateInput(), NewInternalPurchaseOrderPage(), EditResolutionPage(), NewResolutionPage(), EditResolutionModalProps, NewInternalPurchaseOrderFooter(), NewInternalPurchaseOrderHeader() (+12 more)

### Community 92 - "ItemDetailView.tsx"
Cohesion: 0.32
Nodes (7): formatMoney(), getItemTypeName(), InfoChip(), InfoField(), ItemDetailView(), StatusToggle(), TabButton()

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

### Community 97 - "contact/table/columns.tsx"
Cohesion: 0.38
Nodes (5): AvatarInitials(), Contact, getColorFromName(), getInitials(), ContactFilterChipsProps

### Community 98 - "ContactDetailGeneral.tsx"
Cohesion: 0.47
Nodes (4): ContactDetailGeneral(), ContactDetailGeneralProps, RadioGroup(), RadioGroupItem()

### Community 99 - "CuentasPorPagarWidget.tsx"
Cohesion: 0.67
Nodes (3): CuentasPorPagarData, CuentasPorPagarWidget(), CuentasPorPagarWidgetProps

### Community 100 - "[role]/page.tsx"
Cohesion: 0.15
Nodes (18): MODULES, PermissionGroupCard(), RolePermissionsPage(), Tabs(), TabsContent(), TabsList(), TabsTrigger(), ACCESS_LABEL (+10 more)

### Community 103 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 113 - "payments/page.tsx"
Cohesion: 0.53
Nodes (3): PaymentsPage(), usePayments(), PaymentListResponse

### Community 119 - "resolveStockFields"
Cohesion: 0.31
Nodes (12): ItemRow(), ItemRow(), ItemRow(), ItemRow(), useItems(), getComboAvailableUnits(), getComboComponents(), isComboItem() (+4 more)

### Community 120 - "RemissionDetailHeader.tsx"
Cohesion: 0.40
Nodes (5): RemissionDetailHeader(), RemissionDetailHeaderProps, ActionsCell(), isRemissionInvoiced(), StatusBadge()

### Community 121 - "PasswordGateDialog.tsx"
Cohesion: 0.33
Nodes (4): ForgotPasswordPage(), PasswordGateDialog(), PasswordGateDialogProps, useVerifyPassword()

### Community 123 - "dependencies"
Cohesion: 0.07
Nodes (29): axios, lucide-react, dependencies, axios, lucide-react, pusher-js, @radix-ui/react-accordion, @radix-ui/react-dialog (+21 more)

### Community 125 - "showToast"
Cohesion: 0.11
Nodes (27): EditContactContent(), CostCentersPage(), NewInvoicePageContent(), ResolutionsPage(), getSession(), SessionData, NewInvoiceFooter(), NewInvoiceHeader() (+19 more)

### Community 133 - "ChangeEmailDialog.tsx"
Cohesion: 0.50
Nodes (3): ChangeEmailDialog(), ChangeEmailDialogProps, useChangeEmail()

### Community 137 - "alert.tsx"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 140 - "users/page.tsx"
Cohesion: 0.83
Nodes (3): getInitials(), UsersPage(), VALID_ROLES

### Community 141 - "searchable-select.tsx"
Cohesion: 0.17
Nodes (19): CustomFieldModalProps, FALLBACK_FIELD_TYPES, CustomFieldDatePicker(), AsyncSearchableSelectOption, AsyncSearchableSelectProps, Command(), CommandEmpty(), CommandGroup() (+11 more)

### Community 144 - "MonthSelector.tsx"
Cohesion: 0.50
Nodes (3): monthOptions, MonthSelector(), MonthSelectorProps

### Community 145 - "CuentasPorCobrarWidget.tsx"
Cohesion: 0.67
Nodes (3): CuentasPorCobrarData, CuentasPorCobrarWidget(), CuentasPorCobrarWidgetProps

### Community 150 - "FlujoTransaccionesWidget.tsx"
Cohesion: 0.50
Nodes (3): FlujoTransaccionesData, FlujoTransaccionesWidget(), FlujoTransaccionesWidgetProps

### Community 198 - "PaymentFilterChips.tsx"
Cohesion: 0.22
Nodes (9): PaymentTableProps, filterLabels, MOCK_BANK_ACCOUNTS, PAYMENT_STATUSES, PaymentFilterChips(), PaymentFilterChipsProps, paymentFilterOptions, PaymentTableBodyProps (+1 more)

### Community 206 - "button.tsx"
Cohesion: 0.11
Nodes (16): CertificatesPage(), CertificateList(), NewCertificateForm(), NewCertificateModal(), NewCertificateModalProps, CreateWebhookModalProps, QuoteDetailHeader(), QuoteDetailHeaderProps (+8 more)

## Knowledge Gaps
- **629 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+624 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **78 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `showToast()` connect `showToast` to `table.tsx`, `dialog.tsx`, `types/auth.ts`, `NewRemissionMain.tsx`, `invoice/table/columns.tsx`, `PaymentsService`, `ChangeEmailDialog.tsx`, `remissions/new/page.tsx`, `QuoteTable.tsx`, `react`, `dashboard/page.tsx`, `AuthService`, `searchable-select.tsx`, `dropdown-menu.tsx`, `useNotifications.ts`, `QuickCreateItemModal.tsx`, `cn`, `CreditNotesService`, `debounced-input.tsx`, `CommentsAndReminders.tsx`, `lib/items.ts`, `contacts/[id]/page.tsx`, `AdvancedOptionsSection.tsx`, `quotes/[id]/edit/page.tsx`, `InvoicesService`, `quote.ts`, `invoices/[id]/page.tsx`, `activate-account/page.tsx`, `IntegrationsService`, `tooltip.tsx`, `usePurchaseOrders.ts`, `CompanyProfileForm.tsx`, `ApiResponse`, `items/[id]/page.tsx`, `Sidebar.tsx`, `auth-context.tsx`, `PersonalDataSection.tsx`, `TwoFactorPanel.tsx`, `button.tsx`, `items/page.tsx`, `returns/[id]/page.tsx`, `useResolutions`, `payments/page.tsx`, `resolveStockFields`, `RemissionDetailHeader.tsx`, `PasswordGateDialog.tsx`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `table.tsx`, `dialog.tsx`, `NewRemissionMain.tsx`, `PaymentsService`, `sidebar.tsx`, `QuoteTable.tsx`, `searchable-select.tsx`, `dropdown-menu.tsx`, `QuickCreateItemModal.tsx`, `cn`, `debounced-input.tsx`, `AdvancedOptionsSection.tsx`, `quotes/[id]/edit/page.tsx`, `invoices/[id]/page.tsx`, `RemissionTable.tsx`, `contacts/page.tsx`, `ItemResponse`, `purchaseOrder.ts`, `PaymentTable.tsx`, `ItemTable.tsx`, `carousel.tsx`, `cn`, `InvoiceTable.tsx`, `ApiResponse`, `ItemDocumentsTab.tsx`, `form.tsx`, `items/[id]/page.tsx`, `Sidebar.tsx`, `ui/utils.ts`, `ResolutionTable.tsx`, `chart.tsx`, `PaymentFilterChips.tsx`, `button.tsx`, `items/page.tsx`, `softwares.ts`, `useResolutions`, `ItemDetailView.tsx`, `payments/page.tsx`, `RemissionDetailHeader.tsx`, `dependencies`, `showToast`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `next-themes`, `@hookform/resolvers`, `html2canvas`, `input-otp`, `next`, `react-hook-form`, `radix-ui`, `clsx`, `@radix-ui/react-checkbox`, `react`, `@radix-ui/react-label`, `@radix-ui/react-progress`, `jspdf`, `@radix-ui/react-tabs`, `laravel-echo`, `@radix-ui/react-toggle-group`, `postcss`, `react-dom`, `react-qr-code`, `react-resizable-panels`, `@radix-ui/react-alert-dialog`, `sonner`, `@radix-ui/react-aspect-ratio`, `tailwind-merge`, `@radix-ui/react-avatar`, `@tanstack/query-sync-storage-persister`, `@tanstack/react-query-persist-client`, `vaul`, `@radix-ui/react-context-menu`, `@radix-ui/react-hover-card`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-radio-group`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@tabler/icons-react`, `class-variance-authority`, `cmdk`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@radix-ui/react-collapsible`, `@radix-ui/react-tooltip`, `@tanstack/react-table`, `package.json`, `date-fns`, `dayjs`, `geist`, `@dnd-kit/modifiers`, `@dnd-kit/utilities`, `embla-carousel-react`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _629 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `table.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06259183073758448 - nodes in this community are weakly interconnected._
- **Should `dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07824513794663049 - nodes in this community are weakly interconnected._
- **Should `types/catalogs.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._