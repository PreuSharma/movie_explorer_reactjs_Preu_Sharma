import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SubscriptionPage from "../components/Subscription";
const PricingPage: React.FC = () => {
  const [search, setSearch] = React.useState<string>("");

  return (
    <div>
      <Header search={search} setSearch={setSearch} />
      <SubscriptionPage />

      <div className="min-h-screen bg-black text-white py-1 px-1 sm:px-8 md:px-16">
        {/* Compare PLans  */}

        <div className="mt-12 px-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Compare Plans</h2>
          <div className="overflow-x-auto max-w-full">
            <div className="mx-auto w-full max-w-6xl">
              <table className="min-w-full border-collapse border border-gray-300 text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="border border-gray-300 px-4 py-2">
                      Features
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Basic</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Professional
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Team Members", "✔", "✔", "✔"],
                    ["Storage Space", "✔", "✔", "✔"],
                    ["Support Level", "✔", "✔", "✔"],
                    ["API Access", "✘", "✔", "✔"],
                    ["Custom Domain", "✘", "✔", "✔"],
                    ["SSO Integration", "✘", "✔", "✔"],
                    ["Audit Logs", "✘", "✔", "✔"],
                  ].map(([feature, basic, pro, enterprise], i) => (
                    <tr key={i} className="text-center">
                      <td className="border border-gray-300 px-4 py-2 text-left">
                        {feature}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {basic}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {pro}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {enterprise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
