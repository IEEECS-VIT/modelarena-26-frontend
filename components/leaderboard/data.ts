export type Team = {
    rank: number;
    teamId: string;
    teamName: string;
    score: number;
    submittedAt: string | null;
    members: string[];
};

export const mockLeaderboardData: Team[] = [
    {
        rank: 1,
        teamId: "decb1721-43de-4be9-81b4-5d62fbfdcf62",
        teamName: "My purvi Team",
        score: 19.83542904527761,
        submittedAt: "2026-02-04T04:50:41.358Z",
        members: ["puriv@bdak"]
    },
    {
        rank: 2,
        teamId: "e3ab6774-4374-46fe-87e7-8cfdbbf06677",
        teamName: "My running Team",
        score: 19.83542904527761,
        submittedAt: "2026-02-04T05:00:16.880Z",
        members: ["itsrunninga@js", "dsh@gmail"]
    },
    {
        rank: 3,
        teamId: "2003c938-48dd-47be-bb81-9be692981553",
        teamName: "My jfiwe Team",
        score: 16.23795598668164,
        submittedAt: "2026-02-04T17:58:08.798Z",
        members: ["nifhsdu@jksn"]
    }
];
