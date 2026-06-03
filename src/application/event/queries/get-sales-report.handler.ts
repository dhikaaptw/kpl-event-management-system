import { Inject, Injectable } from '@nestjs/common';
import { GetSalesReportQuery } from './get-sales-report.query';
import { SalesReportDto } from '../dtos/event.dto';
import { EVENT_QUERY_REPOSITORY, EventQueryRepository } from './get-published-events.handler';

@Injectable()
export class GetSalesReportHandler {
  constructor(
    @Inject(EVENT_QUERY_REPOSITORY)
    private readonly eventQueryRepository: EventQueryRepository,
  ) {}

  async execute(query: GetSalesReportQuery): Promise<SalesReportDto> {
    return this.eventQueryRepository.getSalesReport(query.eventId);
  }
}
