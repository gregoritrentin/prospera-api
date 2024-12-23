export class MetricValue {
    constructor(
        readonly name: string,
        readonly value: number,
        readonly timestamp: Date,
        readonly metadata?: Record<string, any>
    ) { }

    static create(props: {
        name: string
        value: number
        timestamp?: Date
        metadata?: Record<string, any>
    }): MetricValue {
        return new MetricValue(
            props.name,
            props.value,
            props.timestamp ?? new Date(),
            props.metadata
        )
    }
}