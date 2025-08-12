import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Order } from '@/types/Order';

const ordersFilePath = path.join(process.cwd(), 'src/app/api/data/orders.json');

async function ensureOrdersFile() {
  try {
    await fs.access(ordersFilePath);
    const content = await fs.readFile(ordersFilePath, 'utf-8');
    const data = JSON.parse(content);
    
    if (!data.orders || !Array.isArray(data.orders)) {
      await fs.writeFile(ordersFilePath, JSON.stringify({ orders: [] }, null, 2));
    }
  } catch (error) {
    await fs.writeFile(ordersFilePath, JSON.stringify({ orders: [] }, null, 2));
  }
}

export async function GET() {
  try {
    await ensureOrdersFile();
    const content = await fs.readFile(ordersFilePath, 'utf-8');
    const data = JSON.parse(content);
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureOrdersFile();
    
    const body = await request.json();
    console.log('API Received Body:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    if (!body.customerName || !body.customerEmail || !body.designType) {
      console.log('Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: customerName, customerEmail, designType' },
        { status: 400 }
      );
    }

    // Validate vendor structure only if vendor is provided
    if (body.vendor && (!body.vendor.name || !body.vendor.address || !body.vendor.phone || !body.vendor.email)) {
      console.log('Validation failed: Invalid vendor structure');
      return NextResponse.json(
        { error: 'Invalid vendor information' },
        { status: 400 }
      );
    }

    // For custom designs, ensure customImagePath is provided
    if (body.designType === 'custom' && !body.customImagePath) {
      console.log('Validation failed: Missing customImagePath for custom design');
      console.log('Body designType:', body.designType);
      console.log('Body customImagePath:', body.customImagePath);
      return NextResponse.json(
        { error: 'Custom design image path is required for custom designs' },
        { status: 400 }
      );
    }

    const newOrder: Order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productName: body.productName,
      productType: body.productType,
      quantity: body.quantity,
      basePrice: body.basePrice,
      totalPrice: body.totalPrice,
      designType: body.designType,
      selectedDesign: body.selectedDesign,
      customDesignFile: body.customDesignFile,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      orderDate: body.orderDate || new Date().toISOString(),
      status: body.status || 'pending',
      vendor: body.vendor,
      isCustomDesign: body.isCustomDesign,
      customImagePath: body.customImagePath,
      notes: body.notes
    };

    const content = await fs.readFile(ordersFilePath, 'utf-8');
    const data = JSON.parse(content);
    
    data.orders.push(newOrder);
    
    await fs.writeFile(ordersFilePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json(
      { message: 'Order created successfully', order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 