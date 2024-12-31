export interface IStatisticalResult {
    totalBills: number|0;        
    completedBills: number|0;    
    totalRevenue: number|0;      
}
export interface IStatisticalInvoice {
    totalInvoice: number;      
    completedInvoice: number;  
    totalRevenue: number;      
}
export interface IProductSalesDTO {
    productId?: number;        
    totalAmount: number;       
    totalQuantity: number;     
}
