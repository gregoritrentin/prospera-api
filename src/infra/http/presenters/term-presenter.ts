import { Term } from "@/domain/application/entities/term";

export class TermPresenter {
    static toHttp(term: Term) {
        return {
            id: term.id.toString(),
            title: term.title,
            content: term.content,
            startAt: term.startAt,
            createdAt: term.createdAt,
            updatedAt: term.updatedAt
        }
    }
}