import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SeederService {
  constructor(private readonly logger: Logger) {}

  async seed() {
    return;
  }
}
