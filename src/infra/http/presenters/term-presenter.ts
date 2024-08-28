import { Term } from "@/domain/core/entities/term";
import { title } from "process";

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