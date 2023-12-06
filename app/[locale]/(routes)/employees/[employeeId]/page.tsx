import Container from "@/app/[locale]/(routes)/components/ui/Container";
import { BasicView } from "./components/BasicView";
import { getEmployeesData } from "@/actions/employees/get-employees";
const ContactViewPage = async ({ params }: any) => {
  const { employeeId } = params;
  const employee: any = await getEmployeesData(employeeId);
  if (!employee) return <div>Employees not found</div>;
  return (
    <Container
      title={`Employee detail view: ${employee?.firstName} ${employee?.lastName}`}
      description={"Everything you need to know about employee"}
    >
      <div className="space-y-5">
        <BasicView data={employee} />
      </div>
    </Container>
  );
};

export default ContactViewPage;
