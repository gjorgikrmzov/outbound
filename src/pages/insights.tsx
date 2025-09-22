import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // your logic
  return { props: {} };
};


export default function InsightsPage() {
  return (
    <div>
      <h1>Insights</h1>
      <p>This page works now!</p>
    </div>
  );
}