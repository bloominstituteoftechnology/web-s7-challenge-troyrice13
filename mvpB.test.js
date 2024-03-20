import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Sprint 7 Challenge Learner Tests', () => {
  test('sum function validations', () => {
    expect(() => sum()).toThrow('pass valid numbers');
    expect(() => sum(2, 'seven')).toThrow('pass valid numbers');
    expect(sum(1, 3)).toBe(4);
    expect(sum('1', 2)).toBe(3);
    expect(sum('10', '3')).toBe(13);
  });

  test('HelloWorld component renders correctly', () => {
    render(<HelloWorld />);
    expect(screen.queryByText("Home")).toBeInTheDocument();
    expect(screen.queryByText("About")).toBeInTheDocument();
    expect(screen.queryByText("Blog")).toBeInTheDocument();
    expect(screen.queryByText("The Truth")).toBeInTheDocument();
    expect(screen.queryByText("JavaScript is pretty awesome")).toBeInTheDocument();
    expect(screen.queryByText("javaScript is pretty", { exact: false })).toBeInTheDocument();
  });
});

function sum(a, b) {
  a = Number(a);
  b = Number(b);
  if (isNaN(a) || isNaN(b)) {
    throw new Error('pass valid numbers');
  }
  return a + b;
}

function HelloWorld() {
  return (
    <div>
      <h1>Hello World Component</h1>
      <nav>
        <a href='#'>Home</a>
        <a href='#'>About</a>
        <a href='#'>Blog</a>
      </nav>
      <main>
        <section>
          <h2>The Truth</h2>
          <p>JavaScript is pretty awesome</p>
        </section>
      </main>
    </div>
  );
}
