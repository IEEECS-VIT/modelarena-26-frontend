export default function TeamCard({ team }: any) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border rounded-md p-6">
        <h3 className="text-xl font-semibold">{team.teamName}</h3>
        <p className="text-neutral-500">
          Captain: {team.captain}
        </p>
      </div>

      <div className="border rounded-md p-6">
        <p>
          <strong>Team Code:</strong> {team.teamCode}
        </p>
        <p>
          <strong>Registration No:</strong> {team.regNo}
        </p>
      </div>
    </div>
  );
}
