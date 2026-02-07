import { Injectable } from '@nestjs/common';
import { write } from 'fast-csv';

@Injectable()
export class CsvExportService {
  async generateParticipationCsv(
    participations: Array<{
      name: string;
      birthDate: string;
      applyFee: number | null;
      isPaid: boolean;
      isOwnCar: boolean;
      createdAt: Date;
    }>,
  ): Promise<Buffer> {
    const records = participations.map((p) => ({
      name: p.name,
      birthDate: p.birthDate,
      applyFee: p.applyFee ?? '',
      isPaid: p.isPaid ? 'Yes' : 'No',
      isOwnCar: p.isOwnCar ? 'Yes' : 'No',
      createdAt: p.createdAt.toISOString().split('T')[0],
    }));

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      write(records, {
        headers: true,
        quoteColumns: true,
      })
        .on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        })
        .on('end', () => {
          const csvBuffer = Buffer.concat(chunks);
          const BOM = Buffer.from([0xef, 0xbb, 0xbf]);
          resolve(Buffer.concat([BOM, csvBuffer]));
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
