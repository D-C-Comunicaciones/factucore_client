# Graph Report - .  (2026-08-05)

## Corpus Check
- 439 files · ~238,017 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2004 nodes · 5443 edges · 182 communities (112 shown, 70 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 317,119 input · 0 output

## Community Hubs (Navigation)
- Configuration Page & Company Cards
- Contact Creation Modals
- Configuration Modals (Cost Center, Currency, Resolution)
- Custom Field & Attribute Modals
- App Layout & Auth Pages
- Item/Category Creation Modals
- Certificate & Import Item Pages
- UI Accordion & Dialog Primitives
- Sidebar & Sheet UI Primitives
- Invoice Form Sections
- Quote List Page & Filters
- API Client & Service Hooks
- Dashboard Widgets
- Auth Session & Header Popovers
- Detail Page Headers
- ESLint & Build Dev Dependencies
- Resolution Management
- TypeScript Config
- Item Page & Toasts
- Item Creation Payload Types
- Item Detail View
- shadcn Components Config
- Credit Note Return Detail
- Returns Table & Filters
- Cost Center Table
- Header & Popover Components
- Quote Builder Footer & Header
- UI Alert & Slider Primitives
- Payment Table
- Invoice Formatted Inputs
- New Invoice Page
- Quote Data Types
- Quote Detail Hooks
- Invoice PDF Printing
- Remission Table & Filters
- Contact Table
- Item Documents Filter
- Invoice Data Types
- UI Menubar Primitive
- Remission Data Types
- Contact Detail Tabs
- Return & Payment Detail Summaries
- Remissions Service
- UI Context Menu Primitive
- Catalog Data Types
- Contact/Invoice/Quote Form Providers
- Payment Detail Page
- Tasks Page & Filters
- Item Table
- Invoice Detail Tabs
- Invoice Filter & Table Columns
- UI Carousel Primitive
- Package Dependencies (axios, dayjs, etc.)
- Invoice Table & Filters
- Remission Hooks
- Quote Detail View
- UI Form Primitive
- graphify Extraction Spec Doc
- Credit Note Payload Examples
- Invoice Edit Page
- Item Image Gallery
- Stat Card Component
- Contact Table Columns
- Payment Detail Accounting Tabs
- Payment Filter & Table
- UI Navigation Menu Primitive
- graphify Export Formats Doc
- Reports Page
- Invoice Table Toolbar
- Item Table Filters
- UI Chart Primitive
- UI Pagination Primitive
- graphify Add/Watch Doc
- New Return Form
- Software Management Page
- Item Detail View Helpers
- graphify Skill Pipeline Steps
- graphify CLAUDE.md Overview
- graphify Query Command Doc
- Remissions Page Header
- Skeleton Loading States
- UI Toggle Primitives
- Tenant Data Types
- graphify Update/Cluster Doc
- Dashboard Widget Interfaces
- Invoices Page
- Contact/Invoice Toolbar Filters
- Payment Terms Service
- Sellers Service
- graphify GitHub Merge Doc
- Add Graph Menu (Dashboard)
- New Invoice View
- Payment Detail Info & Status
- Catalog Cache Storage
- graphify Hooks Integration Doc
- graphify Transcribe Doc
- README Boilerplate
- Month Selector Component
- Cuentas Por Cobrar Widget
- Cuentas Por Pagar Widget
- Flujo Transacciones Widget
- Invoice Items Table Types
- Item Basic Info Types
- Item Payload Types
- Next.js Config
- Nested Route Layout A
- Nested Route Layout B
- Nested Route Layout C
- Nested Route Layout D
- Nested Route Layout E
- New Payment Layout
- Empty Dashboard State
- Empty State Widget
- Productos Vendidos Widget
- Document Title Updater
- Loader Component
- Dev Server Proxy Config
- class-variance-authority Dependency
- clsx Dependency
- cmdk Dependency
- date-fns Dependency
- @dnd-kit/core Dependency
- @dnd-kit/modifiers Dependency
- @dnd-kit/sortable Dependency
- @dnd-kit/utilities Dependency
- embla-carousel-react Dependency
- eslint.config.mjs Dependency
- geist Dependency
- @hookform/resolvers Dependency
- html2canvas Dependency
- input-otp Dependency
- jspdf Dependency
- next Dependency
- postcss Dependency
- radix-ui Dependency
- @radix-ui/react-accordion Dependency
- @radix-ui/react-avatar Dependency
- @radix-ui/react-checkbox Dependency
- @radix-ui/react-dialog Dependency
- @radix-ui/react-dropdown-menu Dependency
- @radix-ui/react-label Dependency
- @radix-ui/react-progress Dependency
- @radix-ui/react-select Dependency
- @radix-ui/react-separator Dependency
- @radix-ui/react-switch Dependency
- @radix-ui/react-tabs Dependency
- @radix-ui/react-toggle Dependency
- @radix-ui/react-toggle-group Dependency
- @radix-ui/react-tooltip Dependency
- react-day-picker Dependency
- react-dom Dependency
- react-qr-code Dependency
- react-resizable-panels Dependency
- recharts Dependency
- sonner Dependency
- @tabler/icons-react Dependency
- tailwind-merge Dependency
- tailwindcss-animate Dependency
- @tanstack/query-sync-storage-persister Dependency
- @tanstack/react-query Dependency
- @tanstack/react-query-persist-client Dependency
- @tanstack/react-table Dependency
- vaul Dependency
- zod Dependency
- PostCSS Config
- Avatar Image & User Persona
- Global CSS Types
- Global CSS Types (Ambient)
- New Invoice Mock Data
- FactuCore Logo Image
- Login Page Illustration

## God Nodes (most connected - your core abstractions)
1. `cn()` - 198 edges
2. `cn()` - 138 edges
3. `showToast()` - 128 edges
4. `react` - 113 edges
5. `Button()` - 79 edges
6. `ApiResponse` - 47 edges
7. `DialogContent()` - 46 edges
8. `DialogTitle()` - 46 edges
9. `Dialog()` - 45 edges
10. `DialogHeader()` - 43 edges

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

## Communities (182 total, 70 thin omitted)

### Community 0 - "Configuration Page & Company Cards"
Cohesion: 0.08
Nodes (41): FactucoreLogo(), FactucoreLogoProps, CertificateListProps, CompanySummaryCard(), ConfigCard(), ConfigCardProps, ConfigLink, ConfigurationGrid() (+33 more)

### Community 1 - "Contact Creation Modals"
Cohesion: 0.09
Nodes (35): AddContactModalProps, ModalContent(), PrefilledContactData, ContactAccountingInfo(), ContactAccountingInfoProps, ContactAdvancedFormProps, ContactBasicForm(), ContactBasicFormProps (+27 more)

### Community 2 - "Configuration Modals (Cost Center, Currency, Resolution)"
Cohesion: 0.10
Nodes (26): ConfigCostCentersModalProps, CostCenter, NewCostCenterModalProps, CreateCurrencyModalProps, ProductGalleryModalProps, CreateWarehouseModalProps, VariantGalleryModalProps, NewPaymentTermModalProps (+18 more)

### Community 3 - "Custom Field & Attribute Modals"
Cohesion: 0.08
Nodes (42): AttributeModal(), AttributeModalProps, NewCurrencyModal(), CustomFieldModalProps, FALLBACK_FIELD_TYPES, CustomFieldDatePicker(), ComboProductEntry, PriceListEntry (+34 more)

### Community 4 - "App Layout & Auth Pages"
Cohesion: 0.06
Nodes (38): AuthenticatedLayout(), LoginPage(), RootPage(), ContactDetailGeneral(), ContactDetailGeneralProps, Header(), ExportConfig, ExportItemsModal() (+30 more)

### Community 5 - "Item/Category Creation Modals"
Cohesion: 0.11
Nodes (30): CategoryModalProps, NewCategoryModal(), NewCostCenterModal(), CustomFieldModal(), BLANK_BASIC, QuickCreateItemModal(), QuickCreateItemModalProps, AccountingSection() (+22 more)

### Community 6 - "Certificate & Import Item Pages"
Cohesion: 0.11
Nodes (21): CertificatesPage(), CertificateList(), NewCertificateForm(), NewCertificateFormProps, NewCertificateModal(), NewCertificateModalProps, ContactComments(), InvoiceDetailHeaderProps (+13 more)

### Community 7 - "UI Accordion & Dialog Primitives"
Cohesion: 0.06
Nodes (35): AccordionContent(), AccordionItem(), AccordionTrigger(), AlertDialogOverlay(), Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis() (+27 more)

### Community 8 - "Sidebar & Sheet UI Primitives"
Cohesion: 0.06
Nodes (35): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), Sidebar() (+27 more)

### Community 9 - "Invoice Form Sections"
Cohesion: 0.16
Nodes (24): AddContactModal(), EditResolutionModal(), ProductComboModalProps, NewPaymentTermModal(), OtherIncomeTable(), OtherIncomeTableProps, QuoteExportModalProps, ResolutionFilterChipsProps (+16 more)

### Community 10 - "Quote List Page & Filters"
Cohesion: 0.09
Nodes (29): FacturasVentaViewProps, QuotesPage(), FacturasVentaViewProps, QuotesPage(), QuoteExportModal(), defaultFilterOptions, FilterOption, QuoteFilter() (+21 more)

### Community 11 - "API Client & Service Hooks"
Cohesion: 0.13
Nodes (9): CONTACTS_KEY, ApiClient, AttributePayload, attributesApi, categoriesApi, ContactsService, currenciesApi, priceListsApi (+1 more)

### Community 12 - "Dashboard Widgets"
Cohesion: 0.08
Nodes (28): DashboardPage(), isPredefinedWidget(), PREDEFINED_POSITIONS, SortableWidgetProps, Widget, DeleteWidgetDialog(), DeleteWidgetDialogProps, ClientesConVentasWidget() (+20 more)

### Community 13 - "Auth Session & Header Popovers"
Cohesion: 0.08
Nodes (19): InvoiceDetailPage(), metadata, SessionData, AccountSwitcher(), AccountSwitcherProps, HelpCenterPopover(), HelpCenterPopoverProps, NewPaymentForm() (+11 more)

### Community 14 - "Detail Page Headers"
Cohesion: 0.14
Nodes (19): ContactDetailHeaderProps, CostCenterFilterProps, FilterOption, InvoicePageHeaderProps, StatusToggle(), PaymentDetailHeaderProps, StatusBadge(), QuoteDetailHeaderProps (+11 more)

### Community 15 - "ESLint & Build Dev Dependencies"
Cohesion: 0.06
Nodes (31): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, shadcn (+23 more)

### Community 16 - "Resolution Management"
Cohesion: 0.12
Nodes (23): EditResolutionPage(), NewResolutionPage(), EditResolutionModalProps, baseSchema, formSchema, ResolutionForm(), ResolutionFormProps, ResolutionTable() (+15 more)

### Community 17 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 18 - "Item Page & Toasts"
Cohesion: 0.17
Nodes (17): NewItemPage(), FormState, ItemsPage(), ItemRow(), NewItemForm(), ItemRow(), showToast(), useCreateItem() (+9 more)

### Community 19 - "Item Creation Payload Types"
Cohesion: 0.08
Nodes (26): Image, CreateItemAccounting, CreateItemComboComponent, CreateItemComboSettings, CreateItemCustomField, CreateItemInitialStock, CreateItemInventory, CreateItemPriceList (+18 more)

### Community 20 - "Item Detail View"
Cohesion: 0.11
Nodes (16): ItemDetailPage(), ItemAttachments(), ItemHeader(), ItemHeaderProps, ItemInventory(), ItemInventoryProps, InfoChip(), ItemMainInfo() (+8 more)

### Community 21 - "shadcn Components Config"
Cohesion: 0.08
Nodes (23): aliases, components, hooks, lib, ui, utils, Authorization, iconLibrary (+15 more)

### Community 22 - "Credit Note Return Detail"
Cohesion: 0.15
Nodes (10): ReturnDetailPage(), ReturnDetailHeader(), ReturnDetailSkeleton(), CREDIT_NOTE_KEY(), CREDIT_NOTES_KEY, useCreditNote(), useCreditNotesList(), useSendCreditNote() (+2 more)

### Community 23 - "Returns Table & Filters"
Cohesion: 0.13
Nodes (14): ReturnPageHeader(), ReturnPageHeaderProps, FilterOption, RETURN_FILTER_OPTIONS, ReturnsFilterChips(), ReturnsFilterChipsProps, ReturnsTable(), ReturnsTableProps (+6 more)

### Community 24 - "Cost Center Table"
Cohesion: 0.12
Nodes (19): CostCenterTable(), CostCenterTableProps, ServerPagination, CostCenter, getColumns(), CostCenterFilter(), defaultCostCenterFilterOptions, CostCenterTableBody() (+11 more)

### Community 25 - "Header & Popover Components"
Cohesion: 0.15
Nodes (18): Factucore Horizontal Logo, HeaderProps, SolutionsPopover(), SolutionsPopoverProps, AsyncSearchableSelectOption, AsyncSearchableSelectProps, Command(), CommandDialog() (+10 more)

### Community 26 - "Quote Builder Footer & Header"
Cohesion: 0.14
Nodes (14): CostCentersPage(), NewQuotePage(), NewQuoteFooter(), NewQuoteHeader(), NewQuoteHeaderProps, NewQuoteOptions(), NewQuoteSettingsDrawer(), GlobalAdjustment (+6 more)

### Community 27 - "UI Alert & Slider Primitives"
Cohesion: 0.10
Nodes (11): Alert(), AlertDescription(), AlertTitle(), alertVariants, HoverCardContent(), Progress(), ResizableHandle(), ResizablePanelGroup() (+3 more)

### Community 28 - "Payment Table"
Cohesion: 0.14
Nodes (15): PaymentsPage(), PaymentTable(), SelectionState, ServerPagination, getPaymentColumns(), PaymentTableBody(), PaymentTablePagination(), PaymentTablePaginationProps (+7 more)

### Community 29 - "Invoice Formatted Inputs"
Cohesion: 0.13
Nodes (17): react, react, ResolutionsPage(), ReturnsPage(), ConfigCostCentersModal(), DOCUMENT_TYPES, FormattedInput(), NewInvoiceComments() (+9 more)

### Community 30 - "New Invoice Page"
Cohesion: 0.14
Nodes (16): NewInvoicePage(), NewInvoiceFooter(), NewInvoiceHeader(), NewInvoiceHeaderProps, NewInvoiceOptions(), NewInvoicePayment(), PreviewModal(), PreviewModalProps (+8 more)

### Community 31 - "Quote Data Types"
Cohesion: 0.12
Nodes (17): AllowanceCharge, QuoteBill, QuoteBillingPeriod, QuoteCompany, QuoteCustomer, QuoteDetailResponse, QuoteDian, QuoteEstablishment (+9 more)

### Community 32 - "Quote Detail Hooks"
Cohesion: 0.18
Nodes (10): QuoteDetailPage(), ActionsCell(), INVOICE_KEY(), INVOICES_KEY, usePrefetchQuoteDetail(), useQuote(), useSendQuote(), useUpdateQuote() (+2 more)

### Community 33 - "Invoice PDF Printing"
Cohesion: 0.15
Nodes (3): PrintPdfContent(), InvoicesService, Invoice

### Community 34 - "Remission Table & Filters"
Cohesion: 0.14
Nodes (16): RemissionFilter(), RemissionTable(), RemissionTableProps, ServerPagination, getColumns(), FilterChips(), FilterChipsProps, filterValueToColumnId (+8 more)

### Community 35 - "Contact Table"
Cohesion: 0.15
Nodes (15): Contact, ContactPage(), ContactType, Contact, ContactTable(), ContactTableProps, SelectionState, ServerPagination (+7 more)

### Community 36 - "Item Documents Filter"
Cohesion: 0.13
Nodes (15): FilterField, ItemDocumentsFilterChips(), ItemDocumentsFilterChipsProps, StatusOptionsList(), ColumnConfig, FILTER_FIELDS, FilterField, getFilterKey() (+7 more)

### Community 37 - "Invoice Data Types"
Cohesion: 0.12
Nodes (16): AllowanceCharge, InvoiceBill, InvoiceBillingPeriod, InvoiceCompany, InvoiceCustomer, InvoiceDetailResponse, InvoiceDian, InvoiceEstablishment (+8 more)

### Community 38 - "UI Menubar Primitive"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 39 - "Remission Data Types"
Cohesion: 0.13
Nodes (15): AllowanceCharge, RemissionBill, RemissionBillingPeriod, RemissionCompany, RemissionCustomer, RemissionDetailResponse, RemissionDian, RemissionEstablishment (+7 more)

### Community 40 - "Contact Detail Tabs"
Cohesion: 0.17
Nodes (11): ContactDetailPage(), ContactDetailAttachments(), ContactDetailAttachmentsProps, ContactDetailBranches(), ContactDetailBranchesProps, ContactDetailComments(), ContactDetailCommentsProps, ContactDetailHeader() (+3 more)

### Community 41 - "Return & Payment Detail Summaries"
Cohesion: 0.18
Nodes (10): PaymentDetailTotal(), PaymentDetailTotalProps, ReturnDetailDocument(), ReturnDetailSummary(), ReturnDetailSummaryProps, ReturnDetailTabs(), ReturnDetailTabsProps, ReturnRow() (+2 more)

### Community 42 - "Remissions Service"
Cohesion: 0.17
Nodes (3): ActionsCell(), RemissionsService, Remission

### Community 43 - "UI Context Menu Primitive"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 44 - "Catalog Data Types"
Cohesion: 0.12
Nodes (15): Attribute, Category, Country, CustomField, Department, Municipality, Plan, PriceList (+7 more)

### Community 45 - "Contact/Invoice/Quote Form Providers"
Cohesion: 0.21
Nodes (10): EditContactContent(), NewContactContent(), getSession(), ContactAdvancedForm(), ContactFormProvider(), ContactSidebar(), NewInvoiceMain(), WithholdingsModal() (+2 more)

### Community 46 - "Payment Detail Page"
Cohesion: 0.18
Nodes (8): PaymentDetailPage(), NewPaymentPage(), Attachment, PaymentDetailAttachments(), PaymentDetailAttachmentsProps, PaymentDetailHeader(), usePayment(), PaymentsService

### Community 47 - "Tasks Page & Filters"
Cohesion: 0.16
Nodes (10): NewTaskDrawer(), NewTaskDrawerProps, ASSIGNEE_OPTIONS, FILTER_TABS, PRIORITY_OPTIONS, STATUS_OPTIONS, TaskFiltersPopup(), TaskFiltersPopupProps (+2 more)

### Community 48 - "Item Table"
Cohesion: 0.16
Nodes (12): ItemTable(), SelectionState, ServerPagination, getItemColumns(), ItemTableBody(), ItemTablePagination(), ItemTablePaginationProps, ServerPagination (+4 more)

### Community 49 - "Invoice Detail Tabs"
Cohesion: 0.18
Nodes (9): InvoiceDetailExtraInfo(), InvoiceDetailExtraInfoProps, InvoiceDetailHeader(), InvoiceDetailSummary(), InvoiceDetailSummaryProps, InvoiceDetailTabs(), InvoiceDianStatus(), ActionsCell() (+1 more)

### Community 50 - "Invoice Filter & Table Columns"
Cohesion: 0.19
Nodes (6): defaultFilterOptions, FilterOption, InvoiceFilterProps, filterIcons, filterLabels, Checkbox()

### Community 51 - "UI Carousel Primitive"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 52 - "Package Dependencies (axios, dayjs, etc.)"
Cohesion: 0.15
Nodes (13): axios, dayjs, lucide-react, next-themes, dependencies, axios, dayjs, lucide-react (+5 more)

### Community 53 - "Invoice Table & Filters"
Cohesion: 0.21
Nodes (10): InvoiceTable(), ServerPagination, getColumns(), FilterChips(), filterValueToColumnId, InvoiceTableBody(), InvoiceTablePagination(), InvoiceTablePaginationProps (+2 more)

### Community 54 - "Remission Hooks"
Cohesion: 0.22
Nodes (8): INVOICE_KEY(), INVOICES_KEY, useCreateRemission(), usePrefetchRemissionDetail(), useRemission(), useSendRemission(), useUpdateRemission(), RemissionListData

### Community 55 - "Quote Detail View"
Cohesion: 0.21
Nodes (7): QuoteDetailDocument(), QuoteDetailExtraInfo(), QuoteDetailExtraInfoProps, QuoteDetailHeader(), QuoteDetailSkeleton(), QuoteDetailSummary(), QuoteDetailSummaryProps

### Community 56 - "UI Form Primitive"
Cohesion: 0.23
Nodes (11): FormControl(), FormDescription(), FormField(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue (+3 more)

### Community 57 - "graphify Extraction Spec Doc"
Cohesion: 0.18
Nodes (11): Confidence Score Rubric (EXTRACTED/INFERRED/AMBIGUOUS), extraction-spec.md Reference Guide, Hyperedge Extraction Rule, Node ID Format Spec ({stem}_{entity}), semantically_similar_to Edge Rule, Extraction Subagent Prompt Template, Honesty Rules, Part A: Structural (AST) extraction (+3 more)

### Community 58 - "Credit Note Payload Examples"
Cohesion: 0.42
Nodes (11): CalculationService (Backend), Rationale: Frontend Must Not Send Monetary Amounts, credit_note_reference_index field, POST /api/credit-notes endpoint, POST /api/credit-notes/send endpoint, Tipo 1: Devolución Parcial (Ajuste de Cantidad), Tipo 2: Anulación Completa de la Factura, Tipo 3 y 6: Rebaja / Descuento a Líneas (+3 more)

### Community 59 - "Invoice Edit Page"
Cohesion: 0.35
Nodes (7): InvoiceEditPage(), INVOICE_KEY(), INVOICES_KEY, useInvoice(), usePrefetchInvoiceDetail(), useSendInvoice(), useUpdateInvoice()

### Community 60 - "Item Image Gallery"
Cohesion: 0.36
Nodes (7): ItemImage, ImageUploader(), ImageUploaderProps, ItemGalleryModal(), ItemGalleryModalProps, ItemSidebar(), ItemSidebarProps

### Community 61 - "Stat Card Component"
Cohesion: 0.22
Nodes (9): InvoiceStats, StatCardProps, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+1 more)

### Community 62 - "Contact Table Columns"
Cohesion: 0.29
Nodes (7): AvatarInitials(), Contact, getColorFromName(), getInitials(), ContactFilterChipsProps, contactFilterOptions, filterLabels

### Community 63 - "Payment Detail Accounting Tabs"
Cohesion: 0.27
Nodes (6): PaymentDetailAccounting(), PaymentDetailAccountingAccounts(), PaymentDetailAccountingAccountsProps, PaymentDetailAdvances(), PaymentDetailTabs(), PaymentDetailTabsProps

### Community 64 - "Payment Filter & Table"
Cohesion: 0.22
Nodes (9): PaymentTableProps, filterLabels, MOCK_BANK_ACCOUNTS, PAYMENT_STATUSES, PaymentFilterChips(), PaymentFilterChipsProps, paymentFilterOptions, PaymentTableBodyProps (+1 more)

### Community 65 - "UI Navigation Menu Primitive"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 66 - "graphify Export Formats Doc"
Cohesion: 0.22
Nodes (9): Token reduction benchmark (Step 8), --falkordb / --falkordb-push export (Step 7a), --graphml export (Step 7c), exports.md Reference Guide, --mcp MCP stdio server (Step 7d), --neo4j / --neo4j-push export (Step 7), --svg export (Step 7b), --wiki export (Step 6b) (+1 more)

### Community 67 - "Reports Page"
Cohesion: 0.33
Nodes (5): CategoryCard(), CategoryCardProps, ReportsCategoryGrid(), ReportsHeader(), ReportsSearchBar()

### Community 68 - "Invoice Table Toolbar"
Cohesion: 0.25
Nodes (8): InvoiceTableProps, FilterChipsProps, InvoiceTableBodyProps, InvoiceTableToolbar(), InvoiceTableToolbarProps, WithholdingsModalProps, NewWithholdingModalProps, InvoiceSummary

### Community 69 - "Item Table Filters"
Cohesion: 0.25
Nodes (8): ItemTableProps, filterLabels, ItemFilterChips(), ItemFilterChipsProps, itemFilterOptions, MOCK_WAREHOUSES, ItemTableBodyProps, ItemListResponse

### Community 70 - "UI Chart Primitive"
Cohesion: 0.33
Nodes (7): ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), THEMES, useChart()

### Community 71 - "UI Pagination Primitive"
Cohesion: 0.22
Nodes (7): Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLink(), PaginationLinkProps, PaginationNext(), PaginationPrevious()

### Community 72 - "graphify Add/Watch Doc"
Cohesion: 0.29
Nodes (7): /graphify add <url>, add-watch.md Reference Guide, --watch (background folder watcher), /graphify add and --watch flow (SKILL.md pointer), Interpreter guard for subcommands, /graphify query flow (SKILL.md pointer), --update / --cluster-only subcommands (SKILL.md pointer)

### Community 73 - "New Return Form"
Cohesion: 0.32
Nodes (3): NewReturnForm(), createEmptyLine(), NewReturnForm()

### Community 74 - "Software Management Page"
Cohesion: 0.29
Nodes (6): SoftwarePage(), NewSoftwareModal(), SoftwareList(), CreateSoftwarePayload, SoftwareResponse, softwaresApi

### Community 75 - "Item Detail View Helpers"
Cohesion: 0.32
Nodes (7): formatMoney(), getItemTypeName(), InfoChip(), InfoField(), ItemDetailView(), StatusToggle(), TabButton()

### Community 76 - "graphify Skill Pipeline Steps"
Cohesion: 0.29
Nodes (7): graphify Skill Auto-Trigger Rule, /graphify Full Pipeline, Step 1: Ensure graphify is installed, Step 2: Detect files, Step 5: Label communities, Step 6: Generate Obsidian vault + HTML, Step 9: Save manifest, update cost tracker, clean up, report

### Community 77 - "graphify CLAUDE.md Overview"
Cohesion: 0.29
Nodes (7): GRAPH_REPORT.md, graphify Knowledge Graph System, graphify explain command, graphify path command, graphify query command, graphify update command, graphify-out/wiki/index.md

### Community 78 - "graphify Query Command Doc"
Cohesion: 0.52
Nodes (7): graphify explain "NODE_NAME", query.md Reference Guide, graphify path "A" "B", graphify query "<question>", graphify reflect / LESSONS.md, graphify save-result (work memory), Constrained Query Expansion (Step 0)

### Community 79 - "Remissions Page Header"
Cohesion: 0.38
Nodes (5): FacturasVentaViewProps, RemissionsPage(), RemissionPageHeader(), RemissionPageHeaderProps, useRemissionsList()

### Community 80 - "Skeleton Loading States"
Cohesion: 0.38
Nodes (4): WidgetSkeleton(), WidgetSkeletonProps, InvoiceDetailSkeleton(), Skeleton()

### Community 81 - "UI Toggle Primitives"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 82 - "Tenant Data Types"
Cohesion: 0.29
Nodes (6): CreateTenantInput, createTenantSchema, Tenant, tenantSchema, UpdateTenantInput, updateTenantSchema

### Community 83 - "graphify Update/Cluster Doc"
Cohesion: 0.33
Nodes (6): build_merge() / graph_diff(), --cluster-only, update.md Reference Guide, --update (incremental re-extraction), Step 4.5: Graph health check, Step 4: Build graph, cluster, analyze, generate outputs

### Community 84 - "Dashboard Widget Interfaces"
Cohesion: 0.33
Nodes (3): DashboardViewProps, SortableWidgetProps, Widget

### Community 85 - "Invoices Page"
Cohesion: 0.40
Nodes (5): FacturasVentaViewProps, InvoicesPage(), InvoicePageHeader(), StatCard(), useInvoicesList()

### Community 86 - "Contact/Invoice Toolbar Filters"
Cohesion: 0.33
Nodes (5): contactFilterOptions, ContactTableToolbar(), ContactTableToolbarProps, FilterOption, InvoiceFilter()

### Community 89 - "graphify GitHub Merge Doc"
Cohesion: 0.60
Nodes (5): graphify clone <github-url>, github-and-merge.md Reference Guide, graphify merge-graphs, Monorepo / multi-subfolder merge flow, Step 0: GitHub repos and multi-path merge

### Community 90 - "Add Graph Menu (Dashboard)"
Cohesion: 0.40
Nodes (4): AddGraphMenu(), AddGraphMenuProps, allGraphOptions, GraphOption

### Community 91 - "New Invoice View"
Cohesion: 0.40
Nodes (3): InvoiceItemsTable(), InvoiceItem, NewInvoiceViewProps

### Community 92 - "Payment Detail Info & Status"
Cohesion: 0.50
Nodes (3): PaymentDetailInfo(), PaymentDetailInfoProps, PaymentStatusBadge()

### Community 93 - "Catalog Cache Storage"
Cohesion: 0.80
Nodes (4): canUseStorage(), getStorageKey(), readCatalogCache(), writeCatalogCache()

### Community 94 - "graphify Hooks Integration Doc"
Cohesion: 0.50
Nodes (4): graphify claude install/uninstall (CLAUDE.md integration), graphify hook install/uninstall/status, hooks.md Reference Guide, Commit hook and native CLAUDE.md integration (SKILL.md pointer)

### Community 95 - "graphify Transcribe Doc"
Cohesion: 0.50
Nodes (4): transcribe.md Reference Guide, Domain-hint Whisper Prompt Strategy, Whisper Video/Audio Transcription (Step 2.5), Step 2.5: Video and audio transcription

### Community 96 - "README Boilerplate"
Cohesion: 0.50
Nodes (4): create-next-app CLI, Geist Font (via next/font), Next.js Project (create-next-app bootstrap), Vercel Platform Deployment

### Community 97 - "Month Selector Component"
Cohesion: 0.50
Nodes (3): monthOptions, MonthSelector(), MonthSelectorProps

### Community 98 - "Cuentas Por Cobrar Widget"
Cohesion: 0.67
Nodes (3): CuentasPorCobrarData, CuentasPorCobrarWidget(), CuentasPorCobrarWidgetProps

### Community 99 - "Cuentas Por Pagar Widget"
Cohesion: 0.67
Nodes (3): CuentasPorPagarData, CuentasPorPagarWidget(), CuentasPorPagarWidgetProps

### Community 100 - "Flujo Transacciones Widget"
Cohesion: 0.50
Nodes (3): FlujoTransaccionesData, FlujoTransaccionesWidget(), FlujoTransaccionesWidgetProps

### Community 103 - "Item Basic Info Types"
Cohesion: 0.50
Nodes (4): BaseItemBasicInfo, ComboBasicInfo, ProductBasicInfo, ServiceBasicInfo

### Community 104 - "Item Payload Types"
Cohesion: 0.50
Nodes (4): BaseItemPayload, ComboItemPayload, ProductItemPayload, ServiceItemPayload

## Knowledge Gaps
- **535 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+530 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **70 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Invoice Formatted Inputs` to `Contact Creation Modals`, `Custom Field & Attribute Modals`, `App Layout & Auth Pages`, `Item/Category Creation Modals`, `Certificate & Import Item Pages`, `UI Accordion & Dialog Primitives`, `Sidebar & Sheet UI Primitives`, `Invoice Form Sections`, `Quote List Page & Filters`, `Dashboard Widgets`, `Resolution Management`, `Item Page & Toasts`, `Item Detail View`, `Returns Table & Filters`, `Cost Center Table`, `UI Alert & Slider Primitives`, `Payment Table`, `New Invoice Page`, `Quote Detail Hooks`, `Remission Table & Filters`, `Contact Table`, `Item Documents Filter`, `Remissions Service`, `Payment Detail Page`, `Item Table`, `Invoice Detail Tabs`, `UI Carousel Primitive`, `Package Dependencies (axios, dayjs, etc.)`, `Invoice Table & Filters`, `UI Form Primitive`, `Item Image Gallery`, `Payment Filter & Table`, `Item Table Filters`, `UI Chart Primitive`, `Software Management Page`, `Item Detail View Helpers`, `Remissions Page Header`, `UI Toggle Primitives`, `Invoices Page`?**
  _High betweenness centrality (0.185) - this node is a cross-community bridge._
- **Why does `cn()` connect `UI Accordion & Dialog Primitives` to `Configuration Page & Company Cards`, `Contact Creation Modals`, `Configuration Modals (Cost Center, Currency, Resolution)`, `App Layout & Auth Pages`, `Certificate & Import Item Pages`, `Sidebar & Sheet UI Primitives`, `Invoice Form Sections`, `Detail Page Headers`, `Header & Popover Components`, `UI Alert & Slider Primitives`, `UI Menubar Primitive`, `UI Context Menu Primitive`, `Invoice Filter & Table Columns`, `UI Carousel Primitive`, `UI Form Primitive`, `Stat Card Component`, `UI Navigation Menu Primitive`, `UI Chart Primitive`, `UI Pagination Primitive`, `UI Toggle Primitives`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (axios, dayjs, etc.)` to `geist Dependency`, `@hookform/resolvers Dependency`, `html2canvas Dependency`, `input-otp Dependency`, `jspdf Dependency`, `next Dependency`, `postcss Dependency`, `radix-ui Dependency`, `@radix-ui/react-accordion Dependency`, `@radix-ui/react-avatar Dependency`, `@radix-ui/react-checkbox Dependency`, `@radix-ui/react-dialog Dependency`, `@radix-ui/react-dropdown-menu Dependency`, `@radix-ui/react-label Dependency`, `ESLint & Build Dev Dependencies`, `@radix-ui/react-progress Dependency`, `@radix-ui/react-select Dependency`, `@radix-ui/react-separator Dependency`, `@radix-ui/react-switch Dependency`, `@radix-ui/react-tabs Dependency`, `@radix-ui/react-toggle Dependency`, `@radix-ui/react-toggle-group Dependency`, `@radix-ui/react-tooltip Dependency`, `react-day-picker Dependency`, `react-dom Dependency`, `react-qr-code Dependency`, `react-resizable-panels Dependency`, `recharts Dependency`, `Invoice Formatted Inputs`, `sonner Dependency`, `@tabler/icons-react Dependency`, `tailwind-merge Dependency`, `tailwindcss-animate Dependency`, `@tanstack/query-sync-storage-persister Dependency`, `@tanstack/react-query Dependency`, `@tanstack/react-query-persist-client Dependency`, `@tanstack/react-table Dependency`, `vaul Dependency`, `zod Dependency`, `class-variance-authority Dependency`, `clsx Dependency`, `cmdk Dependency`, `date-fns Dependency`, `@dnd-kit/core Dependency`, `@dnd-kit/modifiers Dependency`, `@dnd-kit/sortable Dependency`, `@dnd-kit/utilities Dependency`, `embla-carousel-react Dependency`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _535 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Configuration Page & Company Cards` be split into smaller, more focused modules?**
  _Cohesion score 0.08111888111888112 - nodes in this community are weakly interconnected._
- **Should `Contact Creation Modals` be split into smaller, more focused modules?**
  _Cohesion score 0.08832425892316999 - nodes in this community are weakly interconnected._
- **Should `Configuration Modals (Cost Center, Currency, Resolution)` be split into smaller, more focused modules?**
  _Cohesion score 0.10025062656641603 - nodes in this community are weakly interconnected._