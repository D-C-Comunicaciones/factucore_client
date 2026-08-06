# Graph Report - efac_frontend  (2026-08-05)

## Corpus Check
- 457 files · ~257,623 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2082 nodes · 5998 edges · 185 communities (113 shown, 72 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d0cd5dc6`
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 198 edges
2. `showToast()` - 149 edges
3. `cn()` - 139 edges
4. `react` - 114 edges
5. `Button()` - 82 edges
6. `ApiResponse` - 49 edges
7. `DialogContent()` - 48 edges
8. `DialogTitle()` - 48 edges
9. `Dialog()` - 47 edges
10. `useCatalogs()` - 47 edges

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

## Communities (185 total, 72 thin omitted)

### Community 0 - "NewReturnForm.tsx"
Cohesion: 0.28
Nodes (14): ContactTableBodyProps, parseDateSafe(), PaymentInvoicesList(), PaymentInvoicesListProps, WithholdingEntry, PopoverAnchor(), Table(), TableBody() (+6 more)

### Community 1 - "tooltip.tsx"
Cohesion: 0.09
Nodes (29): FlujoTransaccionesData, FlujoTransaccionesWidgetProps, TotalVentasWidgetProps, VentasData, InvoiceDianStatusProps, ComboProductEntry, PriceListEntry, WarehouseEntry (+21 more)

### Community 2 - "dialog.tsx"
Cohesion: 0.09
Nodes (30): AttributeModal(), AttributeModalProps, NewCertificateModalProps, ConfigCostCentersModalProps, DOCUMENT_TYPES, ProductGalleryModalProps, CreateWarehouseModalProps, ProductComboModal() (+22 more)

### Community 3 - "AdvancedOptionsSection.tsx"
Cohesion: 0.12
Nodes (10): CertificatesPage(), CertificateList(), NewCertificateForm(), NewCertificateModal(), QuoteDetailHeader(), QuoteDetailHeaderProps, StatusBadge(), NewSoftwareForm() (+2 more)

### Community 4 - "Sidebar.tsx"
Cohesion: 0.13
Nodes (14): Attribute, Category, Country, CustomField, Department, Municipality, Plan, PriceList (+6 more)

### Community 5 - "NewQuoteSettingsDrawer.tsx"
Cohesion: 0.15
Nodes (20): CostCenter, NewCostCenterModal(), NewCostCenterModalProps, NewPaymentTermModalProps, NewPriceListModal(), NewPriceListModalProps, FixedFields, FixedFields (+12 more)

### Community 6 - "invoice/table/columns.tsx"
Cohesion: 0.23
Nodes (12): NewCertificateFormProps, InvoiceDetailHeaderProps, NewSoftwareFormProps, AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription() (+4 more)

### Community 7 - "cn"
Cohesion: 0.07
Nodes (36): AccordionContent(), AccordionItem(), AccordionTrigger(), AlertDialogOverlay(), Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis() (+28 more)

### Community 8 - "sidebar.tsx"
Cohesion: 0.06
Nodes (35): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), Sidebar() (+27 more)

### Community 9 - "NewReturnForm.backup.tsx"
Cohesion: 0.09
Nodes (19): RemissionDetailPage(), DOCUMENT_TYPES, DocumentType, RemissionPageHeader(), envs, REMISSION_KEY(), REMISSIONS_KEY, useDeleteRemission() (+11 more)

### Community 10 - "QuoteTable.tsx"
Cohesion: 0.13
Nodes (18): defaultFilterOptions, QuoteFilter(), QuoteTableProps, ServerPagination, getColumns(), FilterChips(), FilterChipsProps, filterIcons (+10 more)

### Community 11 - "ApiResponse"
Cohesion: 0.12
Nodes (6): ApiClient, AttributePayload, currenciesApi, PaymentTermsService, SellersService, ApiResponse

### Community 12 - "dashboard/page.tsx"
Cohesion: 0.15
Nodes (18): DashboardPage(), isPredefinedWidget(), PREDEFINED_POSITIONS, SortableWidgetProps, Widget, FlujoTransaccionesWidget(), TotalVentasWidget(), clientesConVentasMock (+10 more)

### Community 13 - "auth-context.tsx"
Cohesion: 0.09
Nodes (16): CompanySummaryCard(), ConfigCard(), ConfigCardProps, ConfigLink, ConfigurationGrid(), AccountSwitcher(), AccountSwitcherProps, HelpCenterPopover() (+8 more)

### Community 14 - "button.tsx"
Cohesion: 0.10
Nodes (26): CostCenterFilterProps, FilterOption, InvoicePageHeaderProps, NewInvoiceFooter(), ItemHeaderProps, StatusToggle(), filterLabels, ItemFilterChips() (+18 more)

### Community 15 - "devDependencies"
Cohesion: 0.06
Nodes (31): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, shadcn (+23 more)

### Community 16 - "useResolutions"
Cohesion: 0.39
Nodes (8): EditResolutionPage(), NewResolutionPage(), NewInvoicePayment(), ResolutionForm(), useResolutions(), Resolution, ResolutionsParams, ResolutionsService

### Community 17 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 18 - "showToast"
Cohesion: 0.23
Nodes (10): ItemDetailPage(), NewItemPage(), FormState, ItemsPage(), NewItemFormProps, useCreateItem(), useDeleteItem(), ToggleStatusParams (+2 more)

### Community 19 - "types/items.ts"
Cohesion: 0.08
Nodes (30): Image, BaseItemBasicInfo, BaseItemPayload, ComboBasicInfo, ComboItemPayload, CreateItemAccounting, CreateItemComboComponent, CreateItemComboSettings (+22 more)

### Community 20 - "NewRemissionMain.tsx"
Cohesion: 0.09
Nodes (33): ItemImage, CategoryModalProps, NewCategoryModal(), CustomFieldModal(), BLANK_BASIC, QuickCreateItemModal(), QuickCreateItemModalProps, AccountingSection() (+25 more)

### Community 21 - "components.json"
Cohesion: 0.08
Nodes (23): aliases, components, hooks, lib, ui, utils, Authorization, iconLibrary (+15 more)

### Community 22 - "CreditNotesService"
Cohesion: 0.14
Nodes (11): ReturnDetailPage(), ReturnDetailDocument(), ReturnDetailHeader(), ReturnDetailSkeleton(), CREDIT_NOTE_KEY(), CREDIT_NOTES_KEY, useCreditNote(), useCreditNotesList() (+3 more)

### Community 23 - "ReturnsTableBody.tsx"
Cohesion: 0.29
Nodes (6): ReturnsTable(), ReturnsTableProps, ReturnsTableBody(), ReturnsTablePagination(), ReturnsTablePaginationProps, ReturnsTableToolbar()

### Community 24 - "CostCenterTable.tsx"
Cohesion: 0.11
Nodes (21): CostCentersPage(), ConfigCostCentersModal(), CostCenterTable(), CostCenterTableProps, ServerPagination, CostCenter, getColumns(), CostCenterFilter() (+13 more)

### Community 25 - "lib/utils.ts"
Cohesion: 0.15
Nodes (23): CreateCurrencyModalProps, NewCurrencyModal(), CustomFieldModalProps, FALLBACK_FIELD_TYPES, CustomFieldDatePicker(), ReturnsFilterChipsProps, ToastIcon(), Calendar() (+15 more)

### Community 26 - "invoices/new/page.tsx"
Cohesion: 0.15
Nodes (21): EditContactContent(), NewContactContent(), NewQuotePage(), ResolutionsPage(), getSession(), NewInvoiceMain(), NewInvoiceOptions(), WithholdingsModal() (+13 more)

### Community 27 - "ui/utils.ts"
Cohesion: 0.11
Nodes (10): Alert(), AlertDescription(), AlertTitle(), alertVariants, HoverCardContent(), Progress(), ResizableHandle(), ResizablePanelGroup() (+2 more)

### Community 28 - "PaymentTable.tsx"
Cohesion: 0.12
Nodes (20): PaymentsPage(), PaymentTable(), PaymentTableProps, SelectionState, ServerPagination, getPaymentColumns(), filterLabels, MOCK_BANK_ACCOUNTS (+12 more)

### Community 29 - "react"
Cohesion: 0.12
Nodes (14): react, react, ContactComments(), FormattedInput(), NewInvoiceComments(), FormattedInput(), FormattedInput(), CreateWarehouseModal() (+6 more)

### Community 30 - "QuoteItemsTable.tsx"
Cohesion: 0.11
Nodes (43): AddContactModal(), ContactAccountingInfoProps, EditResolutionModal(), EditResolutionModalProps, InvoiceItemsTable(), ItemRow(), NewPaymentTermModal(), OtherIncomeTableProps (+35 more)

### Community 31 - "quote.ts"
Cohesion: 0.21
Nodes (6): RemissionDetailExtraInfo(), RemissionDetailExtraInfoProps, RemissionDetailSkeleton(), RemissionDetailSummary(), RemissionDetailSummaryProps, SaveBeforeCommentsWarning()

### Community 32 - "useQuotes.ts"
Cohesion: 0.09
Nodes (22): EditQuotePage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), QuoteDetailPage(), QuoteDetailExtraInfo(), QuoteDetailExtraInfoProps, QuoteDetailSkeleton(), QuoteDetailSummary() (+14 more)

### Community 33 - "InvoicesService"
Cohesion: 0.18
Nodes (4): InvoiceDetailPage(), useSendInvoice(), InvoicesService, Invoice

### Community 34 - "remission.ts"
Cohesion: 0.12
Nodes (20): defaultFilterOptions, RemissionFilter(), RemissionTable(), RemissionTableProps, ServerPagination, getColumns(), FilterChips(), FilterChipsProps (+12 more)

### Community 35 - "contacts/page.tsx"
Cohesion: 0.09
Nodes (26): Contact, ContactPage(), ContactType, Contact, ContactTable(), ContactTableProps, SelectionState, ServerPagination (+18 more)

### Community 36 - "items/[id]/page.tsx"
Cohesion: 0.13
Nodes (13): ItemAccounting(), ItemAttachments(), TabConfig, ItemHeader(), ItemInventory(), ItemInventoryProps, InfoChip(), ItemMainInfo() (+5 more)

### Community 37 - "invoice.ts"
Cohesion: 0.14
Nodes (13): AllowanceCharge, InvoiceBill, InvoiceBillingPeriod, InvoiceCompany, InvoiceCustomer, InvoiceDian, InvoiceEstablishment, InvoiceFindAllEmpty (+5 more)

### Community 38 - "cn"
Cohesion: 0.22
Nodes (11): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+3 more)

### Community 39 - "NewItemModal.tsx"
Cohesion: 0.22
Nodes (9): InvoiceStats, StatCardProps, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+1 more)

### Community 40 - "contacts/[id]/page.tsx"
Cohesion: 0.13
Nodes (14): ContactDetailPage(), ContactDetailAttachments(), ContactDetailAttachmentsProps, ContactDetailBranches(), ContactDetailBranchesProps, ContactDetailComments(), ContactDetailCommentsProps, ContactDetailGeneral() (+6 more)

### Community 41 - "returns/[id]/page.tsx"
Cohesion: 0.18
Nodes (11): PaymentDetailAccountingAccounts(), PaymentDetailAccountingAccountsProps, PaymentDetailTotal(), PaymentDetailTotalProps, ReturnDetailSummary(), ReturnDetailSummaryProps, ReturnDetailTabs(), ReturnDetailTabsProps (+3 more)

### Community 42 - "ResolutionTable.tsx"
Cohesion: 0.16
Nodes (12): ResolutionTable(), ResolutionTableProps, ServerPagination, getResolutionColumns(), ResolutionFilterChips(), ResolutionTableBody(), ResolutionTableBodyProps, ResolutionTablePagination() (+4 more)

### Community 43 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 44 - "types/catalogs.ts"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 45 - "AddContactModal.tsx"
Cohesion: 0.14
Nodes (20): AddContactModalProps, ModalContent(), PrefilledContactData, ContactAccountingInfo(), ContactAdvancedForm(), ContactAdvancedFormProps, ContactBasicForm(), ContactBasicFormProps (+12 more)

### Community 46 - "payments/[id]/page.tsx"
Cohesion: 0.12
Nodes (15): AllowanceCharge, QuoteBill, QuoteBillingPeriod, QuoteCompany, QuoteCustomer, QuoteDian, QuoteEstablishment, QuoteFindAllApiData (+7 more)

### Community 47 - "tasks/page.tsx"
Cohesion: 0.16
Nodes (10): NewTaskDrawer(), NewTaskDrawerProps, ASSIGNEE_OPTIONS, FILTER_TABS, PRIORITY_OPTIONS, STATUS_OPTIONS, TaskFiltersPopup(), TaskFiltersPopupProps (+2 more)

### Community 48 - "ItemTable.tsx"
Cohesion: 0.13
Nodes (16): ItemTable(), ItemTableProps, SelectionState, ServerPagination, getItemColumns(), ItemFilterChipsProps, ItemTableBody(), ItemTableBodyProps (+8 more)

### Community 49 - "invoices/[id]/page.tsx"
Cohesion: 0.15
Nodes (10): InvoiceDetailDocument(), InvoiceDetailExtraInfo(), InvoiceDetailExtraInfoProps, InvoiceDetailHeader(), InvoiceDetailSkeleton(), InvoiceDetailSummary(), InvoiceDetailSummaryProps, InvoiceDetailTabs() (+2 more)

### Community 50 - "invoice/table/FilterChips.tsx"
Cohesion: 0.22
Nodes (9): ReturnsPage(), FilterOption, paymentFilterOptions, PaymentTableToolbar(), PaymentTableToolbarProps, ReturnPageHeader(), DebouncedInput(), DebouncedInputProps (+1 more)

### Community 51 - "carousel.tsx"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 52 - "dependencies"
Cohesion: 0.15
Nodes (13): axios, dayjs, lucide-react, next-themes, dependencies, axios, dayjs, lucide-react (+5 more)

### Community 53 - "InvoiceTable.tsx"
Cohesion: 0.14
Nodes (16): InvoiceTable(), InvoiceTableProps, ServerPagination, getColumns(), FilterChips(), filterValueToColumnId, InvoiceTableBody(), InvoiceTableBodyProps (+8 more)

### Community 54 - "remissions/[id]/edit/page.tsx"
Cohesion: 0.10
Nodes (34): NewInvoicePage(), EditRemissionPage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), NewRemissionPage(), SessionData, NewInvoiceHeader(), NewInvoiceHeaderProps (+26 more)

### Community 55 - "AuthService"
Cohesion: 0.32
Nodes (11): formatMoney(), getClientName(), getDocDate(), getDocNumber(), getDocStatus(), getDocTotal(), ItemDocumentsTab(), resolveDoc() (+3 more)

### Community 56 - "ResolutionForm.tsx"
Cohesion: 0.13
Nodes (18): ContactDetailGeneralProps, ExportConfig, ExportItemsModal(), ExportItemsModalProps, FormControl(), FormDescription(), FormField(), FormFieldContext (+10 more)

### Community 57 - "Extraction Subagent Prompt Template"
Cohesion: 0.18
Nodes (11): Confidence Score Rubric (EXTRACTED/INFERRED/AMBIGUOUS), extraction-spec.md Reference Guide, Hyperedge Extraction Rule, Node ID Format Spec ({stem}_{entity}), semantically_similar_to Edge Rule, Extraction Subagent Prompt Template, Honesty Rules, Part A: Structural (AST) extraction (+3 more)

### Community 58 - "CalculationService (Backend)"
Cohesion: 0.42
Nodes (11): CalculationService (Backend), Rationale: Frontend Must Not Send Monetary Amounts, credit_note_reference_index field, POST /api/credit-notes endpoint, POST /api/credit-notes/send endpoint, Tipo 1: Devolución Parcial (Ajuste de Cantidad), Tipo 2: Anulación Completa de la Factura, Tipo 3 y 6: Rebaja / Descuento a Líneas (+3 more)

### Community 59 - "useInvoices.ts"
Cohesion: 0.27
Nodes (9): InvoiceEditPage(), INVOICE_KEY(), INVOICES_KEY, useInvoice(), usePrefetchInvoiceDetail(), useUpdateInvoice(), InvoiceDetailResponse, InvoiceFindAllSuccess (+1 more)

### Community 60 - "QuickCreateItemModal.tsx"
Cohesion: 0.13
Nodes (14): AllowanceCharge, RemissionBill, RemissionBillingPeriod, RemissionCompany, RemissionCustomer, RemissionDian, RemissionEstablishment, RemissionFindAllEmpty (+6 more)

### Community 61 - "useCatalogs"
Cohesion: 0.23
Nodes (7): Logo(), LogoHorizontal(), CollapseButton(), SidebarProps, WorkspaceSelector(), ScrollArea(), ScrollBar()

### Community 62 - "ExportItemsModal.tsx"
Cohesion: 0.20
Nodes (10): EditItemPage(), UseItemsParams, useItemById(), useUpdateItem(), itemsApi, PaginatedData, GetItemByIdResponse, ItemsListApiData (+2 more)

### Community 63 - "PaymentDetailTabs.tsx"
Cohesion: 0.21
Nodes (9): AuthenticatedLayout(), LoginPage(), RootPage(), Header(), Sidebar(), UserMenu(), UserMenuProps, useAuth() (+1 more)

### Community 64 - "drawer.tsx"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 65 - "navigation-menu.tsx"
Cohesion: 0.33
Nodes (5): RemissionDetailHeader(), RemissionDetailHeaderProps, ActionsCell(), isRemissionInvoiced(), StatusBadge()

### Community 66 - "exports.md Reference Guide"
Cohesion: 0.22
Nodes (9): Token reduction benchmark (Step 8), --falkordb / --falkordb-push export (Step 7a), --graphml export (Step 7c), exports.md Reference Guide, --mcp MCP stdio server (Step 7d), --neo4j / --neo4j-push export (Step 7), --svg export (Step 7b), --wiki export (Step 6b) (+1 more)

### Community 67 - "ReportsSections.tsx"
Cohesion: 0.33
Nodes (5): CategoryCard(), CategoryCardProps, ReportsCategoryGrid(), ReportsHeader(), ReportsSearchBar()

### Community 68 - "CertificateList.tsx"
Cohesion: 0.29
Nodes (7): FacturasVentaViewProps, QuotesPage(), FacturasVentaViewProps, QuotesPage(), QuotePageHeader(), QuoteTable(), useQuotesList()

### Community 69 - "ItemFilterChips.tsx"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 70 - "chart.tsx"
Cohesion: 0.14
Nodes (18): DistribucionGastosWidget(), DistribucionGastosWidgetProps, GastoItem, ClienteItem, MejoresClientesWidget(), MejoresClientesWidgetProps, ProductoItem, ProductosMasVendidosWidget() (+10 more)

### Community 71 - "pagination.tsx"
Cohesion: 0.25
Nodes (7): defaultFilterOptions, FilterOption, InvoiceFilter(), InvoiceFilterProps, FilterChipsProps, filterIcons, filterLabels

### Community 72 - "--update / --cluster-only subcommands (SKILL.md pointer)"
Cohesion: 0.29
Nodes (7): /graphify add <url>, add-watch.md Reference Guide, --watch (background folder watcher), /graphify add and --watch flow (SKILL.md pointer), Interpreter guard for subcommands, /graphify query flow (SKILL.md pointer), --update / --cluster-only subcommands (SKILL.md pointer)

### Community 73 - "NewReturnForm"
Cohesion: 0.17
Nodes (9): ChangeClientModal(), ChangeTypeModal(), ExitFormModal(), AddedLine, NewReturnForm(), createEmptyLine(), FieldError, NewReturnForm() (+1 more)

### Community 74 - "softwares.ts"
Cohesion: 0.18
Nodes (12): SoftwarePage(), CertificateListProps, NewSoftwareModal(), SoftwareList(), SoftwareListProps, Badge(), badgeVariants, Skeleton() (+4 more)

### Community 75 - "ItemDetailView.tsx"
Cohesion: 0.28
Nodes (8): formatMoney(), getItemTypeName(), InfoChip(), InfoField(), ItemDetailView(), ItemDetailViewProps, StatusToggle(), TabButton()

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
Nodes (13): FactucoreLogo(), FactucoreLogoProps, InvoiceDetailDocumentProps, DianStatusBadge(), QuoteDetailDocument(), QuoteDetailDocumentProps, RemissionDetailDocument(), RemissionDetailDocumentProps (+5 more)

### Community 81 - "toggle-group.tsx"
Cohesion: 0.33
Nodes (4): metadata, CustomToaster(), ThemeProvider(), Providers()

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
Nodes (5): FacturasVentaViewProps, InvoicesPage(), InvoicePageHeader(), StatCard(), useInvoicesList()

### Community 87 - "package.json"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 89 - "github-and-merge.md Reference Guide"
Cohesion: 0.60
Nodes (5): graphify clone <github-url>, github-and-merge.md Reference Guide, graphify merge-graphs, Monorepo / multi-subfolder merge flow, Step 0: GitHub repos and multi-path merge

### Community 90 - "AddGraphMenu.tsx"
Cohesion: 0.40
Nodes (4): AddGraphMenu(), AddGraphMenuProps, allGraphOptions, GraphOption

### Community 91 - "breadcrumb.tsx"
Cohesion: 0.40
Nodes (4): FilterOption, RETURN_FILTER_OPTIONS, ReturnsFilterChips(), ReturnsTableToolbarProps

### Community 92 - "PaymentDetailInfo.tsx"
Cohesion: 0.10
Nodes (15): PaymentDetailPage(), NewPaymentPage(), PaymentDetailAccounting(), PaymentDetailAdvances(), Attachment, PaymentDetailAttachments(), PaymentDetailAttachmentsProps, PaymentDetailHeader() (+7 more)

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

### Community 100 - "PaymentInvoicesList.tsx"
Cohesion: 0.67
Nodes (3): FacturasVentaViewProps, RemissionsPage(), useRemissionsList()

### Community 104 - "alert.tsx"
Cohesion: 0.67
Nodes (3): MenuItem(), MenuItemProps, SidebarMenuItem

### Community 113 - "EmptyDashboardState.tsx"
Cohesion: 0.27
Nodes (4): EmptyDashboardState(), EmptyDashboardStateProps, ClientesConVentasWidget(), ClientesConVentasWidgetProps

### Community 141 - "SolutionsPopover.tsx"
Cohesion: 0.15
Nodes (18): Factucore Horizontal Logo, HeaderProps, SolutionsPopover(), SolutionsPopoverProps, AsyncSearchableSelectOption, AsyncSearchableSelectProps, Command(), CommandDialog() (+10 more)

## Knowledge Gaps
- **550 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+545 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **72 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `tooltip.tsx`, `dialog.tsx`, `AdvancedOptionsSection.tsx`, `NewQuoteSettingsDrawer.tsx`, `cn`, `sidebar.tsx`, `QuoteTable.tsx`, `button.tsx`, `useResolutions`, `showToast`, `NewRemissionMain.tsx`, `ReturnsTableBody.tsx`, `CostCenterTable.tsx`, `lib/utils.ts`, `invoices/new/page.tsx`, `ui/utils.ts`, `PaymentTable.tsx`, `QuoteItemsTable.tsx`, `useQuotes.ts`, `remission.ts`, `contacts/page.tsx`, `items/[id]/page.tsx`, `ResolutionTable.tsx`, `ItemTable.tsx`, `invoices/[id]/page.tsx`, `invoice/table/FilterChips.tsx`, `carousel.tsx`, `dependencies`, `InvoiceTable.tsx`, `remissions/[id]/edit/page.tsx`, `AuthService`, `ResolutionForm.tsx`, `PaymentDetailTabs.tsx`, `navigation-menu.tsx`, `CertificateList.tsx`, `chart.tsx`, `softwares.ts`, `ItemDetailView.tsx`, `invoices/page.tsx`, `package.json`, `PaymentDetailInfo.tsx`, `PaymentInvoicesList.tsx`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `showToast()` connect `invoices/new/page.tsx` to `NewReturnForm.tsx`, `tooltip.tsx`, `dialog.tsx`, `AdvancedOptionsSection.tsx`, `NewQuoteSettingsDrawer.tsx`, `invoice/table/columns.tsx`, `NewReturnForm.backup.tsx`, `dashboard/page.tsx`, `auth-context.tsx`, `button.tsx`, `useResolutions`, `showToast`, `NewRemissionMain.tsx`, `CreditNotesService`, `CostCenterTable.tsx`, `lib/utils.ts`, `PaymentTable.tsx`, `react`, `QuoteItemsTable.tsx`, `quote.ts`, `useQuotes.ts`, `InvoicesService`, `contacts/[id]/page.tsx`, `AddContactModal.tsx`, `invoices/[id]/page.tsx`, `remissions/[id]/edit/page.tsx`, `ExportItemsModal.tsx`, `navigation-menu.tsx`, `CertificateList.tsx`, `NewReturnForm`, `PaymentDetailInfo.tsx`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `tooltip.tsx`, `dialog.tsx`, `NewQuoteSettingsDrawer.tsx`, `invoice/table/columns.tsx`, `sidebar.tsx`, `SolutionsPopover.tsx`, `button.tsx`, `ui/utils.ts`, `QuoteItemsTable.tsx`, `NewItemModal.tsx`, `context-menu.tsx`, `types/catalogs.ts`, `carousel.tsx`, `ResolutionForm.tsx`, `drawer.tsx`, `ItemFilterChips.tsx`, `chart.tsx`, `softwares.ts`, `package.json`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _550 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `tooltip.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08780841799709724 - nodes in this community are weakly interconnected._
- **Should `dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0861952861952862 - nodes in this community are weakly interconnected._
- **Should `AdvancedOptionsSection.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._