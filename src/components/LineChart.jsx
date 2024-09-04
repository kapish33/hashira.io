import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { RiAddCircleLine, RiCloseCircleLine, RiExpandDiagonalLine } from "@remixicon/react";
import { timeIntervals } from "@/types/tabs";
import { cn } from "@/lib/utils";

const LineChart = ({ data, timeFrames, setTimeFrame }) => {
  const [modal, setModal] = useState(false);
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 2000, height: 550 });

  useEffect(() => {
    // Function to handle resizing
    const handleResize = () => {
      const svgElement = svgRef.current;
      if (svgElement) {
        setDimensions({
          width: svgElement.clientWidth,
          height: svgElement.clientHeight,
        });
      }
    };


    // Set initial dimensions
    handleResize();

    // Attach resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [modal]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    const margin = { top: 30, right: 40, bottom: 2, left: 0 };

    // Clear previous chart
    svg.selectAll("*").remove();

    // Define the gradient
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", height - margin.bottom)
      .attr("x2", 0)
      .attr("y2", margin.top);

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "white");

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#bfdbfe");

    // Calculate the min and max values for the Y-axis
    const minValue = d3.min(data, (d) => d.value);
    const maxValue = d3.max(data, (d) => d.value);

    // Adjust the Y scale to start just below the minimum value
    const yScale = d3
      .scaleLinear()
      .domain([minValue * 0.95, maxValue])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const yVolumeScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.volume)])
      .nice()
      .range([height - margin.bottom, height - 80]);

    const xScale = d3
      .scaleBand()
      .domain(data.map((_, i) => i))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const line = d3
      .line()
      .x((_, i) => xScale(i) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    const area = d3
      .area()
      .x((_, i) => xScale(i) + xScale.bandwidth() / 2)
      .y0(height - margin.bottom)
      .y1((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "url(#line-gradient)") // Apply the gradient fill
      .attr("d", area);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (_, i) => xScale(i))
      .attr("y", (d) => yVolumeScale(d.volume))
      .attr("width", xScale.bandwidth() * 0.8)
      .attr("height", (d) => height - margin.bottom - yVolumeScale(d.volume))
      .attr("fill", "rgba(128, 128, 128, 0.4)");

    // Number of lines you want to draw
    const numLines = 6;

    // Calculate the spacing between each line
    const lineSpacing = (width - margin.left - margin.right) / (numLines - 1);

    // Append a group for the vertical lines
    const linesGroup = svg.append("g").attr("class", "vertical-lines");

    // Draw each line
    for (let i = 0; i < numLines; i++) {
      linesGroup
        .append("line")
        .attr("x1", margin.left + i * lineSpacing)
        .attr("y1", margin.top)
        .attr("x2", margin.left + i * lineSpacing)
        .attr("y2", height - margin.bottom)
        .attr("stroke", "lightgray")
        .attr("stroke-width", 0.5)
        .attr("stroke-linecap", "round");
    }

    const trackingGroup = svg
      .append("g")
      .attr("class", "tracking-group")
      .style("pointer-events", "none");

    const verticalLine = trackingGroup
      .append("line")
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "10,5")
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .style("opacity", 0);

    const horizontalLine = trackingGroup
      .append("line")
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "10,5")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .style("opacity", 0);

    const tooltipGroup = svg
      .append("g")
      .attr("class", "tooltip-group")
      .style("pointer-events", "none");

    // Fixed tooltip for the last data point
    const lastPoint = data[data.length - 1];
    const lastPointX = xScale(data.length - 1) + xScale.bandwidth() / 2;
    const lastPointY = yScale(lastPoint.value);

    // Add a background rectangle with rounded corners for the fixed tooltip text
    tooltipGroup
      .append("rect")
      .attr("x", lastPointX - 40) // Adjust the x position to center the rectangle
      .attr("y", lastPointY - 30) // Adjust the y position above the circle
      .attr("width", 80)
      .attr("height", 30)
      .attr("fill", "#4B40EE") // Background color for the tooltip
      .attr("rx", 5) // Rounded corners
      .attr("ry", 5); // Rounded corners

    tooltipGroup
      .append("circle")
      .attr("cx", lastPointX)
      .attr("cy", lastPointY)
      .attr("r", 4)
      .attr("fill", "#4B40EE"); // Tooltip circle color

    tooltipGroup
      .append("text")
      .attr("x", lastPointX - 30) // Position text to fit inside rectangle
      .attr("y", lastPointY - 15) // Centered vertically within the rectangle
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "12px")
      .attr("fill", "white") // Text color
      .text(`${lastPoint.value}`);

    // Oscillating gray tooltip
    const grayTooltipGroup = svg
      .append("g")
      .attr("class", "gray-tooltip-group")
      .style("pointer-events", "none")
      .style("opacity", 0); // Initially hidden

    const grayTooltipRect = grayTooltipGroup
      .append("rect")
      .attr("x", lastPointX - 40)
      .attr("y", height / 2 - 15) // Initial y position
      .attr("width", 80)
      .attr("height", 30)
      .attr("fill", "gray") // Gray background color
      .attr("rx", 5)
      .attr("ry", 5);

    const grayTooltipCircle = grayTooltipGroup
      .append("circle")
      .attr("cx", lastPointX)
      .attr("cy", height / 2) // Initial y position
      .attr("r", 4)
      .attr("fill", "gray"); // Gray tooltip circle color

    const grayTooltipText = grayTooltipGroup
      .append("text")
      .attr("x", lastPointX - 30)
      .attr("y", height / 2 - 15)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "12px")
      .attr("fill", "white")
      .text("Value"); // Placeholder text

    svg.on("mousemove", function (event) {
      grayTooltipGroup.style("opacity", 1);
      const [x, y] = d3.pointer(event);

      // Find the closest data point
      const xIndex = xScale.domain().findIndex((i) => {
        const xPos = xScale(i) + xScale.bandwidth() / 2;
        return xPos >= x;
      });
      const dataIndex = xIndex === -1 ? data.length - 1 : xIndex;
      const closestDataPoint = data[dataIndex];

      // Find the y coordinate of the closest data point
      const closestY = yScale(closestDataPoint.value);

      // Update the oscillating gray tooltip
      grayTooltipGroup
        .select("rect")
        .attr("x", lastPointX - 40)
        .attr("y", y - 15); // Center vertically with respect to the mouse y position

      grayTooltipGroup.select("circle").attr("cx", lastPointX).attr("cy", y);

      grayTooltipGroup
        .select("text")
        .attr("x", lastPointX - 30)
        .attr("y", y + 3)
        .text(closestDataPoint ? `${closestDataPoint.value}` : "Value");

      // Update the fixed tooltip position
      tooltipGroup
        .select("rect")
        .attr("x", lastPointX - 40)
        .attr("y", lastPointY - 30);

      tooltipGroup
        .select("circle")
        .attr("cx", lastPointX)
        .attr("cy", lastPointY);

      tooltipGroup
        .select("text")
        .attr("x", lastPointX - 30)
        .attr("y", lastPointY - 15);

      verticalLine.attr("x1", x).attr("x2", x).style("opacity", 1);

      horizontalLine.attr("y1", y).attr("y2", y).style("opacity", 1);
    });

    svg.on("mouseleave", function () {
      verticalLine.style("opacity", 0);
      horizontalLine.style("opacity", 0);
      grayTooltipGroup.style("opacity", 0);
    });
  }, [data, dimensions,modal]);

  return (
    <>
      <div className="flex flex-wrap justify-between w-full pt-2">
        <div className="flex space-x-2">
          <button onClick={() => setModal(true)} className="flex items-center px-4 py-2 gap-2 bg">
            <RiAddCircleLine /> Fullscreen
          </button>
          <button className="flex items-center px-4 py-2 gap-2">
            <RiExpandDiagonalLine /> Compare
          </button>
        </div>
        <div className="flex gap-2">
          {timeIntervals.map((interval) => {
            return (
              <button
                key={interval}
                onClick={() => setTimeFrame(interval)}
                className={cn(
                  "px-4 py-2",
                  interval == timeFrames && "bg-[#4B40EE] text-white rounded-md"
                )}
              >
                {interval}
              </button>
            );
          })}
        </div>
      </div>

      <svg ref={svgRef} height={dimensions.height} width={dimensions.width} />

      {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
            <div className="relative w-full h-full bg-white p-4">
              <button
                onClick={() => setModal(false)}
                className="absolute top-0 right-0 p-2 text-gray-700 bg-white rounded-full hover:bg-gray-100"
                title="Close"
              >
                <RiCloseCircleLine size={24} />
              </button>
              <svg ref={svgRef} className={cn("w-full h-full")}></svg>
            </div>
          </div>
        )}
    </>
  );
};

export default LineChart;
