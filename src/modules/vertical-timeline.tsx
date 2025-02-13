import React, { useState } from 'react';
import './vertical-timeline.css';
import { min } from 'three/tsl';

interface TimelineNode {
  title: string;
  description: string;
  date: Date;
}

interface TimelineProps {
  nodes: TimelineNode[];
}

const tickContainerSize = 100;

const generateTicks = (nodes: TimelineNode[], ascendingOrder: boolean = true) => {
  const dates = nodes.map(node => node.date);

  // Set the min and max dates from the nodes, and add a month buffer
  const monthBuffer = 1;
  const minDate = new Date(dates.reduce((min, date) => Math.min(min, date.getTime()), Infinity));
  minDate.setMonth(minDate.getMonth() - monthBuffer);

  const maxDate = new Date(dates.reduce((max, date) => Math.max(max, date.getTime()), -Infinity));
  maxDate.setMonth(maxDate.getMonth() + monthBuffer);
  
  const ticks: Date[] = [];
  const currentDate = (ascendingOrder) ? new Date(minDate) : new Date(maxDate);
  const monthIncrement = (ascendingOrder) ? 1 : -1;
  const condition = (ascendingOrder) ?
    () => currentDate <= maxDate : () => currentDate >= minDate;

  while (condition()) {
    ticks.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + monthIncrement);
  }

  return {
    dates: ticks,
    elements: ticks.map((date, index) => (
      <div key={index} className='tick-container' style={{ height: `${tickContainerSize}px` }}>
        <div className='tick'>
          {date.toLocaleString('default', { month: 'short', year: 'numeric' })}
        </div>
        <div className='tick-dot'></div>
      </div>
    ))
  };
};

const VerticalTimeline: React.FC<TimelineProps> = ({nodes}) => {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const {dates, elements: ticks} = generateTicks(nodes, false);

  const createNode = (node: TimelineNode, index: number) => {
    const monthIndex = dates.findIndex(date => {
      const year = date.getFullYear() === node.date.getFullYear()
      const month = date.getMonth() === node.date.getMonth()
      return year && month; 
    });
    return (
      <div key={index}
            style={{ 
              top: `${monthIndex * tickContainerSize}px`,
              left: index % 2 === 0 ? '60%' : '10%',
              width: '20%'
            }}
            className='node-container'
            onClick={() => setSelectedNode(selectedNode === index ? null : index)}>
        <div className='node-dot'></div>
        <div className='node-content'>
          <h3 className='node-title'>{node.title}</h3>
          {selectedNode === index && <p className='node-description'>{node.description}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className='timeline-container'>
      <div className='timeline-line'></div>
      {ticks}
      {nodes.map((node, index) => createNode(node, index))}
    </div>
  );
};

export {VerticalTimeline};
