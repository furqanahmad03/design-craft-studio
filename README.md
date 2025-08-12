# CustomCraft - Customer Service Portal

A modern, responsive customer service application built with Next.js, TypeScript, and shadcn/ui components.

## Features

- **Products Bar**: Browse and select from a collection of customizable products
- **Decorations Bar**: Choose from various design elements and patterns
- **Order System**: Complete order placement with product selection, design customization, and customer details
- **File Upload**: Support for custom design uploads (JPG, PNG, SVG, AI, PSD)
- **Modern UI**: Built with shadcn/ui components for consistent design
- **Responsive Design**: Optimized for all screen sizes
- **TypeScript**: Full type safety throughout the application

## Components

### Navbar.tsx
- Brand logo and navigation
- Design Studio and Support links
- Get Started call-to-action button

### ProductsBar.tsx
- Displays all available products in card format
- Shows pricing, stock, colors, and materials
- Category-based filtering and visual indicators
- Order buttons for each product

### DecorationBar.tsx
- Shows available decoration options
- Type-based categorization (Pattern, Illustration, Logo, Text, Code)
- Size indicators and placement options
- Color palette display
- Order buttons for each decoration

### OrderDialog.tsx
- Comprehensive order placement dialog
- Product selection (if not pre-selected)
- Quantity selection with stock validation
- Design options: premade or custom upload
- Customer information collection
- Order summary and pricing calculation
- File upload for custom designs

## Data Structure

The application uses three main data sources:

- **Products**: Clothing, Electronics, Sports, Stationery, and more
- **Decorations**: Patterns, Illustrations, Logos, Text, and Code elements
- **Orders**: Customer orders with product and design specifications

## API Endpoints

### `/api/orders`
- **GET**: Retrieve all orders
- **POST**: Create new order

### `/api/upload`
- **POST**: Upload custom design files to `public/customDesigns/`

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React hooks
- **Notifications**: Sonner
- **File Upload**: Built-in Next.js API routes

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── data/
│   │   │   ├── products.json
│   │   │   ├── decorations.json
│   │   │   └── orders.json
│   │   ├── orders/
│   │   │   └── route.ts
│   │   └── upload/
│   │       └── route.ts
│   ├── types/
│   │   ├── Product.ts
│   │   ├── Decoration.ts
│   │   └── Order.ts
│   └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── ProductsBar.tsx
│   ├── DecorationBar.tsx
│   ├── OrderDialog.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── checkbox.tsx
│       ├── textarea.tsx
│       └── badge.tsx
├── lib/
│   └── utils.ts
└── public/
    └── customDesigns/
```

## Order Flow

1. **Product Selection**: Choose from available products or decorations
2. **Design Choice**: Select premade design or upload custom file
3. **Customization**: Specify quantity, colors, and placement
4. **Customer Details**: Provide name, email, and notes
5. **Order Summary**: Review pricing and details
6. **Submission**: Place order and receive confirmation

## File Upload

- **Supported Formats**: JPG, PNG, SVG, AI, PSD
- **Size Limit**: 5MB maximum
- **Storage**: Files saved to `public/customDesigns/`
- **Validation**: File type and size checking

## Customization

- Modify product data in `src/app/api/data/products.json`
- Update decoration options in `src/app/api/data/decorations.json`
- Adjust styling using Tailwind CSS classes
- Add new shadcn/ui components as needed
- Customize order validation and processing

## License

This project is open source and available under the [MIT License](LICENSE).
