import { Palette, Image, Type, Code, Sparkles, Star, MapPin, Clock } from 'lucide-react';
import decorationsData from '../app/api/data/decorations.json';
import { Decoration } from '../types/Decoration';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DecorationBar() {
  const decorations: Decoration[] = decorationsData.decorations;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Design Decorations</h2>
        <p className="text-gray-600">Beautiful designs to enhance your products</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {decorations.map((decoration, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg sm:text-xl text-gray-900 mb-2">
                    {decoration.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {decoration.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {decoration.style}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {decoration.size}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-xl font-medium text-purple-600">
                    {decoration.placement}
                  </div>
                  <div className="text-sm text-gray-500">
                    {decoration.fileFormat}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Style:</span>
                  <span className="font-medium text-gray-900">{decoration.style}</span>
                </div>
                
                {decoration.colorPalette && decoration.colorPalette.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">Color Palette:</span>
                    <div className="flex flex-wrap gap-2">
                      {decoration.colorPalette.map((color: string, colorIndex: number) => (
                        <Badge 
                          key={colorIndex} 
                          variant="outline" 
                          className="text-xs px-2 py-1"
                        >
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-purple-900">
                    Perfect for {decoration.placement}
                  </div>
                  <div className="text-xs text-purple-700">
                    Available in {decoration.fileFormat} format
                  </div>
                </div>

                {/* Vendor Information */}
                <div className="border-t pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      Designer Info
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{decoration.vendor.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs text-gray-600">{decoration.vendor.rating}/5.0</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{decoration.vendor.timeline}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {decoration.vendor.specializations.slice(0, 2).map((spec, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs px-1 py-0.5">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0">
              <div className="w-full text-center text-sm text-gray-500">
                Select this decoration in the order form above
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 