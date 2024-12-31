export interface IOTP
{
 Email: string;
 Otp1: string;
 Expiration: Date;
 CreatedAt: Date;
 IsUsed: boolean;
 Attempts: number;
}
