import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { ParafinWidget } from "@parafin/react";
import { Header } from "./components/Header.tsx";
import { SideNav } from "./components/SideNav.tsx";

function App() {
  const [token, setToken] = useState(null);
  const [tab, setTab] = useState("capital");
  const [state, setState] = useState( "no_offers");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Change to false to use production or sandbox production environment
    const isDevEnvironment = false;

    const fetchToken = async () => {
      // Replace with your own Person ID. It should begin with "person_".
      const personId = "person_7133904d-2b47-46c8-9f0b-4b48b913a465";

      // Fetch Parafin token from server
      const response = await axios.get(
        `/parafin/token/${personId}/${isDevEnvironment}`
      );
      setToken(response.data.parafinToken);
    };

    if (!token) {
      fetchToken();
    }

    // Fetch the fixture token when the state changes
      const fetchState = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/mockOffers?state=${state}`);

        setToken(response.data.parafinToken);
      } catch (error) {
        console.error("Error fetching mock data:", error);
      } finally {
        setLoading(false);
      }
    };

      fetchState();
    
  },[state]);

  const onOptIn = async () => ({
    businessExternalId: "ba4cd06d-e256-4562-8ffc-372c7a2ead8c",
    legalBusinessName: "MR Auto Parts, LLC",
    dbaName: "MR Auto Parts",
    ownerFirstName: "Mritunjay",
    ownerLastName: "Anup",
    accountManagers: [
      {
        name: "Vineet Goel",
        email: "test1@parafin.com",
      },
    ],
    routingNumber: "322271627",
    accountNumberLastFour: "4242",
    bankAccountCurrencyCode: "USD",
    email: "test2@parafin.com",
    phoneNumber: "123456789",
    address: {
      addressLine1: "1264 West Avenue",
      city: "Redwood",
      state: "CA",
      postalCode: "12345",
      country: "US",
    },
  });

  if (!token) {
    return <LoadingShell>loading...</LoadingShell>;
  }

  return (
    <div>
      <Header />
      <ContentShell>
        <SideNav onClick={(newProduct) => setTab(newProduct)} />
        {tab === "capital" && (
          <PageShell>
            <DropdownShell>
              <label>
                <strong>Select Offer State:</strong>{" "}
                <select
                  value={state}
                  onChange={(e) => {setState(e.target.value);
                                    localStorage.setItem("selectedOfferState", e.target.value);}}>
                  <option value="no_offers">No Offers</option>
                  <option value="pre_approved">Pre-Approved Offer</option>
                  {/* <option value="capital_on_way">Capital on way</option> */}
                  <option value="offer_accepted">Offer Accepted</option>
                </select>
              </label>
            </DropdownShell>
            <ParafinWidget
              token={token}
              product="capital"
              // Optional props below, see docs.parafin.com for more information
              externalBusinessId={undefined}
              onOptIn={onOptIn}
            />
          </PageShell>
        )}
        {/* {tab === "analytics" && (
          <PageShell>
            <h2>Analytics</h2>
          </PageShell>
        )}
        {tab === "payouts" && (
          <PageShell>
            <h2>Payouts</h2>
          </PageShell>
        )} */}
      </ContentShell>
    </div>
  );
}

export default App;

const ContentShell = styled.div`
  display: flex;
  flex-direction: row;
`;

const LoadingShell = styled.div`
  padding: 20px;
`;

const PageShell = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 40px;
  max-width: 1100px;
`;

const DropdownShell = styled.div`
  margin-bottom: 20px;
`;
