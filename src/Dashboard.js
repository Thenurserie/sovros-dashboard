import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Paper,
  Grid,
  Button,
  IconButton,
  Container,
  TextField,
  Fade,
  Zoom,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';

// Sample department data
const departments = [
  { id: 'dispatch', name: 'Dispatch & Logistics', description: 'Manage trips and driver dispatch.' },
  { id: 'inventory', name: 'Inventory Management', description: 'Update and track inventory easily.' },
  { id: 'social', name: 'Social Hub', description: 'Manage your private social media feeds.' },
  { id: 'agriculture', name: 'Agriculture & Nursery', description: 'Monitor crops and schedule tasks.' },
];

// Sample agents mapped to departments
const agentsByDept = {
  dispatch: [
    { id: 'agent1', name: 'Trip Planner Pro', description: 'Schedules and optimizes trips.', installed: true },
    { id: 'agent2', name: 'Driver Optimizer', description: 'Suggests optimal routes.', installed: false },
  ],
  inventory: [
    { id: 'agent3', name: 'Square Inventory Agent', description: 'Updates inventory via voice commands.', installed: false },
  ],
  social: [
    { id: 'agent4', name: 'Private Feed Manager', description: 'Manages and encrypts your social feeds.', installed: true },
  ],
  agriculture: [
    { id: 'agent5', name: 'Crop Scheduler', description: 'Schedules watering and harvesting tasks.', installed: true },
  ],
};

// Custom theme using MUI's sx prop will be applied inline for simplicity.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4caf50' },
    secondary: { main: '#ff9800' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

// DepartmentTile: A clickable card representing a department
function DepartmentTile({ dept, onSelect }) {
  return (
    <Fade in timeout={500}>
      <Paper
        sx={{
          p: 2,
          m: 1,
          backgroundColor: '#1e1e1e',
          color: 'white',
          cursor: 'pointer',
          '&:hover': { backgroundColor: '#333' },
        }}
        onClick={() => onSelect(dept)}
      >
        <Typography variant="h5">{dept.name}</Typography>
        <Typography variant="body2">{dept.description}</Typography>
      </Paper>
    </Fade>
  );
}

// AgentCard: Displays an individual agent with install/open button
function AgentCard({ agent, onOpen }) {
  return (
    <Zoom in timeout={500}>
      <Paper
        sx={{
          p: 2,
          m: 1,
          backgroundColor: '#282828',
          color: 'white',
        }}
      >
        <Typography variant="h6">{agent.name}</Typography>
        <Typography variant="body2">{agent.description}</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 1 }}
          onClick={() => onOpen(agent)}
        >
          {agent.installed ? 'Open' : 'Install'}
        </Button>
      </Paper>
    </Zoom>
  );
}

// TabPanel: A container for each live agent view in the tabbed interface
function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

// Dashboard: The main component for SovrOS Dashboard UI
function Dashboard() {
  const [activeDept, setActiveDept] = useState(null);
  const [agentTabs, setAgentTabs] = useState([]); // Each tab holds an agent object.
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState(departments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFilteredDepartments(
      departments.filter((dept) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  // Handle department selection and reset agent tabs.
  const handleDeptSelect = (dept) => {
    setActiveDept(dept);
    setAgentTabs([]);
    setCurrentTab(0);
  };

  // Add an agent to the tab view.
  const handleOpenAgent = (agent) => {
    setAgentTabs((prevTabs) => [...prevTabs, agent]);
    setCurrentTab(agentTabs.length);
  };

  // Close an agent tab.
  const handleCloseTab = (index) => {
    setAgentTabs((prevTabs) => prevTabs.filter((_, i) => i !== index));
    setCurrentTab((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // Render agents for the selected department.
  const renderAgents = () => {
    if (!activeDept) return null;
    const agents = agentsByDept[activeDept.id] || [];
    return (
      <Grid container spacing={2}>
        {agents.map((agent) => (
          <Grid item xs={12} sm={6} md={4} key={agent.id}>
            <AgentCard agent={agent} onOpen={handleOpenAgent} />
          </Grid>
        ))}
      </Grid>
    );
  };

  // Simulate API call to fetch dynamic agent status
  const fetchAgentStatus = async (agentId) => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Simulate fetching agent status
      const status = Math.random() > 0.5 ? 'online' : 'offline';
      console.log(`Agent ${agentId} status: ${status}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Error handling and loading indicator
  const renderError = () => {
    if (error) {
      return (
        <Box sx={{ color: 'red', mb: 2 }}>
          <Typography variant="body1">Error: {error}</Typography>
        </Box>
      );
    }
    return null;
  };

  const renderLoading = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      );
    }
    return null;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
        <AppBar position="static" sx={{ backgroundColor: '#333' }}>
          <Toolbar>
            <Typography variant="h4">SovrOS Dashboard</Typography>
          </Toolbar>
        </AppBar>
        <Container sx={{ p: 2 }}>
          {renderError()}
          {renderLoading()}
          {!activeDept ? (
            <Box>
              <TextField
                label="Search Departments"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ input: { color: 'white' }, label: { color: 'white' } }}
              />
              <Grid container spacing={2}>
                {filteredDepartments.map((dept) => (
                  <Grid item xs={12} sm={6} md={4} key={dept.id}>
                    <DepartmentTile dept={dept} onSelect={handleDeptSelect} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box>
              <Button variant="outlined" sx={{ mb: 2, color: 'white', borderColor: 'white' }} onClick={() => setActiveDept(null)}>
                Back to Departments
              </Button>
              <Typography variant="h5" gutterBottom>
                {activeDept.name} Agents
              </Typography>
              {renderAgents()}
            </Box>
          )}
          {agentTabs.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Active Agent Views</Typography>
              <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} aria-label="Agent Tabs">
                {agentTabs.map((agent, index) => (
                  <Tab key={index} label={agent.name} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} />
                ))}
              </Tabs>
              {agentTabs.map((agent, index) => (
                <TabPanel key={index} value={currentTab} index={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{agent.name} Dashboard</Typography>
                    <IconButton onClick={() => handleCloseTab(index)} sx={{ color: 'white' }}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    [This area displays real-time data, logs, and interactive controls for {agent.name}.]
                  </Typography>
                </TabPanel>
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
