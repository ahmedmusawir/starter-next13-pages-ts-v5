import Head from "next/head";
import React from "react";
import { Row } from "../ui-ux";
import { Page } from "../globals";

const RadixOneContent = () => {
  return (
    <>
      <Head>
        <title>Next Page RadixOneContent</title>
        <meta name="description" content="This is the demo page" />
      </Head>
      <Page className={""} FULL={false}>
        <Row className="prose max-w-3xl mx-auto">
          <h1 className="h1">This is the Page RadixOneContent (Copy Me)</h1>
          <h2 className="h2">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit
          </h2>
          <h3 className="h3">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit
          </h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Est
            molestias pariatur earum praesentium tempore natus asperiores alias
            facere delectus ullam? At in ducimus et delectus, autem veniam quas
            natus quam?
          </p>
        </Row>
      </Page>
    </>
  );
};

export default RadixOneContent;
