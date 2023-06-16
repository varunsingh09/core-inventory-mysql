import React from "react";
import { Col, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <Row className="footer">
      <Col>
        <a
          href={"https://github.com/andresdotfelipe"}
          target={"_blank"}
          rel={"noopener noreferrer"}
        >
          <span>Created by Andrés Felipe Pérez Rodríguez</span>
          <i className="fas fa-external-link-alt"></i>
        </a>
      </Col>
    </Row>
  );
};

export default Footer;
