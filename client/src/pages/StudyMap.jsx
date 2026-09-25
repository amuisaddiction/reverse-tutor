import React, { useState, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Network, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StudyMap = ({ onStart }) => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const graphRef = useRef();

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    try {
      const res = await fetch('https://reverse-tutor.onrender.com/api/graph');
      const data = await res.json();
      if (data && data.nodes && data.nodes.length > 0) {
        setGraphData(data);
      } else {
        throw new Error("Empty graph or MongoDB missing");
      }
    } catch (error) {
      console.error('Failed to fetch graph data:', error);
      // Fallback for Hackathon Demo to prevent empty screen
      setGraphData({
        nodes: [
          { id: "kinematics", label: "Kinematics", masteryScore: 60, type: "root" },
          { id: "projectile_motion", label: "Projectile Motion", masteryScore: 40, type: "root" },
          { id: "vector_resolution", label: "Vector Resolution", masteryScore: 30, type: "prerequisite" },
          { id: "relative_velocity", label: "Relative Velocity", masteryScore: 50, type: "prerequisite" },
          { id: "newtons_laws", label: "Newton's Laws", masteryScore: 70, type: "root" }
        ],
        links: [
          { source: "kinematics", target: "projectile_motion" },
          { source: "vector_resolution", target: "projectile_motion" },
          { source: "relative_velocity", target: "kinematics" },
          { source: "newtons_laws", target: "kinematics" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (node) => {
    // Zoom to node
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(2, 2000);
    }
  };

  // Node glowing logic based on mastery score
  const getNodeColor = (node) => {
    if (node.masteryScore >= 70) return '#10b981'; // Emerald (Strong)
    if (node.masteryScore >= 40) return '#f59e0b'; // Amber (Moderate)
    return '#ef4444'; // Red (Weak)
  };

  return (
    <div className="min-h-screen bg-vercel-dark p-8 flex flex-col font-sans">
      <header className="mb-6 border-b border-vercel-border pb-4">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Network className="text-electric-indigo" /> Misconception Graph
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          A live, evolving constellation of your Physics knowledge. 
          <span className="text-emerald-400 font-medium ml-2">Green nodes</span> are mastered, 
          <span className="text-red-400 font-medium ml-2">Red nodes</span> need attention.
        </p>
      </header>

      <div className="flex-1 bg-vercel-card border border-vercel-border rounded-xl relative overflow-hidden shadow-2xl">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-10 bg-vercel-dark/80 backdrop-blur-sm">
            <Loader2 className="w-10 h-10 animate-spin text-electric-indigo mb-4" />
            <p>Scanning neuro-cognitive models...</p>
          </div>
        ) : (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeColor={getNodeColor}
            nodeRelSize={8}
            linkColor={() => '#334155'}
            linkWidth={1.5}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            onNodeClick={handleNodeClick}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.label;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); 

              ctx.fillStyle = 'rgba(10, 15, 30, 0.8)';
              ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = getNodeColor(node);
              ctx.fillText(label, node.x, node.y);

              // Glow effect
              ctx.shadowBlur = 15;
              ctx.shadowColor = getNodeColor(node);
              ctx.beginPath();
              ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI, false);
              ctx.fillStyle = getNodeColor(node);
              ctx.fill();
              ctx.shadowBlur = 0; // Reset
            }}
          />
        )}

        {/* Floating Legend / Action Card */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-6 right-6 w-80 bg-vercel-dark/95 backdrop-blur-md border border-vercel-border rounded-xl p-6 shadow-2xl"
          >
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest text-slate-500">Diagnostic Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Strongest Concept</span>
                <span className="text-emerald-400 font-medium text-sm">
                  {graphData.nodes.length ? [...graphData.nodes].sort((a,b)=>b.masteryScore-a.masteryScore)[0].label : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Weakest Concept</span>
                <span className="text-red-400 font-medium text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {graphData.nodes.length ? [...graphData.nodes].sort((a,b)=>a.masteryScore-b.masteryScore)[0].label : '-'}
                </span>
              </div>
              
              <div className="pt-4 mt-4 border-t border-vercel-border">
                <button 
                  onClick={() => onStart({ label: 'Vector Resolution', emoji: '🎯' }, 'Hard')} // Mock action
                  className="w-full bg-electric-indigo text-white font-medium py-3 rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                >
                  Target Weakest Node <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudyMap;
