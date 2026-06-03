import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AddTicketCategoryCommand } from './add-ticket-category.command';
import { EventRepository } from 'src/domain/event/event.repository';
import { Money } from 'src/domain/shared/money.value-object';
import { EVENT_REPOSITORY } from './create-event.handler';

@Injectable()
export class AddTicketCategoryHandler {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(command: AddTicketCategoryCommand): Promise<string> {
    const event = await this.eventRepository.findById(command.eventId);
    if (!event) throw new NotFoundException('Event not found');

    const categoryId = uuidv4();
    event.addTicketCategory({
      id: categoryId,
      name: command.name,
      price: Money.create(command.priceAmount, command.priceCurrency),
      quota: command.quota,
      salesStartDate: command.salesStartDate,
      salesEndDate: command.salesEndDate,
    });

    await this.eventRepository.save(event);
    return categoryId;
  }
}
