import { ShoppingBag, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CustomCraft</h1>
            <p className="text-sm text-gray-500">Customer Service Portal</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link href="/orders">
            <Button variant="outline" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">View Orders</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
} 