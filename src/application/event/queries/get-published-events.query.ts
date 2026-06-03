export class GetPublishedEventsQuery {
  constructor(
    public readonly filterDate?: Date,
    public readonly filterLocation?: string,
  ) {}
}
