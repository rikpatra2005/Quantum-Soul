import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import time
from datetime import datetime

# ==========================================
# 1. PAGE CONFIGURATION & CUSTOM CSS
# ==========================================
st.set_page_config(page_title="QuantumAI-HIV | SIH 2026", layout="wide", page_icon="🧬")

st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
    .main { background-color: #f8f9fa; }
    .stButton>button { background-color: #004d99; color: white; border-radius: 8px; border: none; padding: 10px 20px; font-weight: 600; }
    .stButton>button:hover { background-color: #003366; }
    .metric-card { background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eaeaea; }
    .quantum-card { background: linear-gradient(135deg, #1a0033 0%, #4b0082 100%); color: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(75,0,130,0.3); }
    .quantum-card .stMetricValue { color: #00ffcc !important; }
    .header { color: #004d99; font-weight: 700; }
    .risk-high { color: #d9534f; font-weight: bold; font-size: 1.2em; background: #fdf0f0; padding: 10px; border-radius: 8px; border-left: 5px solid #d9534f;}
    .risk-moderate { color: #f0ad4e; font-weight: bold; font-size: 1.2em; background: #fdf8f0; padding: 10px; border-radius: 8px; border-left: 5px solid #f0ad4e;}
    .risk-low { color: #5cb85c; font-weight: bold; font-size: 1.2em; background: #f0fdf4; padding: 10px; border-radius: 8px; border-left: 5px solid #5cb85c;}
    .sidebar-footer { font-size: 0.8em; color: #888; margin-top: 50px; }
</style>
""", unsafe_allow_html=True)

# ==========================================
# 2. MOCK ML & QUANTUM FUNCTIONS
# ==========================================
def calculate_zvi(state, education, employment):
    base_risk = {'Maharashtra': 0.25, 'Karnataka': 0.20, 'Andhra Pradesh': 0.20, 'Tamil Nadu': 0.20, 'Telangana': 0.15, 'Other': 0.10}
    zvi = base_risk.get(state, 0.10)
    if education in ['Primary', 'None']: zvi += 0.15
    if employment == 'Unemployed': zvi += 0.10
    return min(zvi, 1.0)

def classical_inference(cd4, wbc, zvi, symptoms_count):
    # Simulating XGBoost/CatBoost/ANN Ensemble
    risk = 0.2 + (1 - (cd4 / 1000)) * 0.4 + (1 - (wbc / 10000)) * 0.1 + (zvi * 0.2) + (symptoms_count * 0.05)
    return min(max(risk + np.random.normal(0, 0.02), 0.01), 0.99)

def quantum_inference(cd4, zvi, age):
    # Simulating 4-Qubit VQC (Angle Encoding + Entanglement)
    # Quantum models often capture non-linear boundaries differently
    q_risk = 0.25 + (1 - (cd4 / 1000)) * 0.35 + (zvi * 0.25) + ((age - 30)/100) * 0.1
    return min(max(q_risk + np.random.normal(0, 0.015), 0.01), 0.99)

# ==========================================
# 3. SESSION STATE
# ==========================================
if 'logged_in' not in st.session_state: st.session_state.logged_in = False
if 'patient_data' not in st.session_state: st.session_state.patient_data = {}
if 'results' not in st.session_state: st.session_state.results = {}

# ==========================================
# 4. LOGIN PAGE
# ==========================================
if not st.session_state.logged_in:
    st.markdown("<h1 class='header' style='text-align: center; margin-top: 50px;'>🧬 QuantumAI-HIV Prediction System</h1>", unsafe_allow_html=True)
    st.markdown("<p style='text-align: center; font-size: 1.2em; color: #555;'>Secure Edge-Cloud Portal for Healthcare Professionals | SIH 2026</p>", unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([1,2,1])
    with col2:
        with st.form("login_form"):
            username = st.text_input("Username", placeholder="Enter Doctor ID (e.g., DOC_001)")
            password = st.text_input("Password", type="password", placeholder="Enter Secure Key")
            submitted = st.form_submit_button("🔐 Login to Dashboard", use_container_width=True)
            if submitted:
                if username and password: 
                    st.session_state.logged_in = True
                    st.rerun()
                else:
                    st.error("Please enter valid credentials.")

# ==========================================
# 5. MAIN DASHBOARD
# ==========================================
else:
    st.sidebar.title("🩺 Navigation")
    st.sidebar.success(f"Logged in as: Dr. Sushovan Das")
    st.sidebar.markdown("---")
    page = st.sidebar.radio("Go to", ["📋 1. Patient & IoT Intake", "🧬 2. Clinical Biomarkers", "⚛️ 3. AI & Quantum Engine", "📊 4. Zonal Insights & Report"])
    
    st.sidebar.markdown("---")
    st.sidebar.markdown('<div class="sidebar-footer">🛡️ Ethical Compliance:<br>CITI Certified (MIMIC-III Ready)<br>DPDP Act 2023 Compliant</div>', unsafe_allow_html=True)
    
    if st.sidebar.button("🚪 Logout", use_container_width=True):
        st.session_state.logged_in = False
        st.session_state.patient_data = {}
        st.session_state.results = {}
        st.rerun()

    # --- PAGE 1: PATIENT & IoT INTAKE ---
    if page == "📋 1. Patient & IoT Intake":
        st.header("📋 Patient Demographics & Edge-IoT Telemetry")
        st.markdown("Capture socio-demographic data and fetch real-time biosensor data from the ESP32/Pico 2 W node.")
        
        col1, col2 = st.columns(2)
        with col1:
            with st.form("demographics_form"):
                st.subheader("👤 Demographics")
                name = st.text_input("Patient Name / ID", value="P_ID_8842")
                age = st.number_input("Age", min_value=10, max_value=100, value=35)
                gender = st.selectbox("Gender", ["Male", "Female", "Other"])
                state = st.selectbox("State", ["Maharashtra", "Karnataka", "Andhra Pradesh", "Tamil Nadu", "Telangana", "Other"])
                education = st.selectbox("Education Level", ["None", "Primary", "Secondary", "Tertiary"])
                employment = st.selectbox("Employment Status", ["Employed", "Unemployed", "Student"])
                submit_demo = st.form_submit_button("Calculate ZVI & Save", use_container_width=True)
                
        with col2:
            st.subheader("📡 Edge-IoT Biosensors (TinyML Node)")
            st.markdown("Simulating MQTT data stream from Raspberry Pi Pico 2 W.")
            if st.button("🔄 Fetch Live Telemetry", use_container_width=True):
                with st.spinner("Connecting to ESP32 via MQTT..."):
                    time.sleep(1.5)
                    st.session_state['iot_data'] = {
                        'spo2': np.random.randint(88, 99),
                        'heart_rate': np.random.randint(65, 110),
                        'temp': round(np.random.uniform(97.5, 101.2), 1),
                        'sync_status': 'Success'
                    }
                    st.success("Telemetry Received!")
            
            if 'iot_data' in st.session_state:
                iot = st.session_state['iot_data']
                st.metric("SpO2 Level", f"{iot['spo2']}%", delta="-2%" if iot['spo2'] < 95 else None)
                st.metric("Heart Rate", f"{iot['heart_rate']} bpm")
                st.metric("Body Temp", f"{iot['temp']} °F")
                st.caption(f"🟢 Sync Status: {iot['sync_status']} | Protocol: MQTT/TLS")

        if submit_demo:
            zvi = calculate_zvi(state, education, employment)
            st.session_state.patient_data = {
                'name': name, 'age': age, 'gender': gender, 'state': state, 
                'education': education, 'employment': employment, 'zvi': zvi
            }
            st.success(f"✅ Profile Saved! Zonal Vulnerability Index (ZVI) Calculated: {zvi:.2f}")

    # --- PAGE 2: CLINICAL & BIOMARKERS ---
    elif page == "🧬 2. Clinical Biomarkers":
        st.header("🧬 Symptom & Biomarker Analysis")
        st.info("ℹ️ **Leakage-Proof Design:** HIV RNA/Viral Load is strictly excluded from inputs to prevent target leakage. Used only for ground-truth validation.")
        
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("🤒 Symptom Check")
            fever = st.checkbox("Fever / Night Sweats")
            fatigue = st.checkbox("Severe Fatigue")
            weight_loss = st.checkbox("Unexplained Weight Loss")
            cough = st.checkbox("Chronic Cough (TB risk)")
            symptoms_count = sum([fever, fatigue, weight_loss, cough])
        
        with col2:
            st.subheader("🩸 General Biomarkers")
            cd4 = st.number_input("CD4 Count (cells/mm³)", min_value=0, max_value=2000, value=450)
            wbc = st.number_input("WBC Count (cells/mcL)", min_value=0, max_value=20000, value=6000)
            hemoglobin = st.number_input("Hemoglobin (g/dL)", min_value=0.0, max_value=20.0, value=13.5)

        if st.button("Analyze Clinical Data", use_container_width=True):
            st.session_state.patient_data.update({
                'symptoms': [fever, fatigue, weight_loss, cough],
                'symptoms_count': symptoms_count,
                'cd4': cd4, 'wbc': wbc, 'hemoglobin': hemoglobin
            })
            st.success("✅ Clinical data recorded. Proceed to AI & Quantum Engine.")

    # --- PAGE 3: AI & QUANTUM ENGINE ---
    elif page == "⚛️ 3. AI & Quantum Engine":
        st.header("⚛️ Hybrid Classical-Quantum Risk Assessment")
        
        if 'cd4' not in st.session_state.patient_data:
            st.warning("⚠️ Please complete Patient Intake and Clinical Data first.")
        else:
            st.markdown("### ⚙️ Processing Pipeline...")
            progress_bar = st.progress(0)
            status_text = st.empty()
            
            for i, step in enumerate(["Initializing Classical Ensemble (XGBoost/CatBoost)...", 
                                      "Compressing features via PCA (4D Latent Space)...", 
                                      "Encoding into 4-Qubit Variational Quantum Circuit (VQC)...", 
                                      "Running Quantum Entanglement & Measurement...", 
                                      "Calculating Hybrid Stacking Ensemble..."]):
                status_text.text(step)
                time.sleep(0.6)
                progress_bar.progress((i + 1) * 20)
            
            # Run Models
            p = st.session_state.patient_data
            classical_score = classical_inference(p['cd4'], p['wbc'], p['zvi'], p['symptoms_count'])
            quantum_score = quantum_inference(p['cd4'], p['zvi'], p['age'])
            final_score = (classical_score * 0.6) + (quantum_score * 0.4) # Hybrid Ensemble
            
            st.session_state.results = {
                'classical': classical_score, 'quantum': quantum_score, 'final': final_score
            }
            status_text.text("✅ Inference Complete.")
            
            # Display Results
            col1, col2, col3 = st.columns(3)
            with col1:
                st.markdown('<div class="metric-card">', unsafe_allow_html=True)
                st.metric("Classical ML Ensemble", f"{classical_score*100:.1f}%")
                st.caption("XGBoost + CatBoost + ANN")
                st.markdown('</div>', unsafe_allow_html=True)
            with col2:
                st.markdown('<div class="quantum-card">', unsafe_allow_html=True)
                st.metric("4-Qubit VQC (Quantum)", f"{quantum_score*100:.1f}%")
                st.caption("Angle Encoding + StronglyEntanglingLayers")
                st.markdown('</div>', unsafe_allow_html=True)
            with col3:
                st.markdown('<div class="metric-card" style="border: 2px solid #004d99;">', unsafe_allow_html=True)
                st.metric("Final Hybrid Risk", f"{final_score*100:.1f}%")
                st.caption("Stacking Meta-Learner")
                st.markdown('</div>', unsafe_allow_html=True)

            # Risk Categorization
            if final_score > 0.7:
                st.markdown("<p class='risk-high'>🚨 HIGH RISK: Immediate ICTC Referral & Confirmatory Testing Recommended</p>", unsafe_allow_html=True)
            elif final_score > 0.4:
                st.markdown("<p class='risk-moderate'>⚠️ MODERATE RISK: Recommend Follow-up Biomarker Screening</p>", unsafe_allow_html=True)
            else:
                st.markdown("<p class='risk-low'>✅ LOW RISK: Routine Annual Screening Advised</p>", unsafe_allow_html=True)

    # --- PAGE 4: ZONAL INSIGHTS & REPORT ---
    elif page == "📊 4. Zonal Insights & Report":
        st.header("📊 Explainable AI & Zonal Heatmap")
        
        if 'final' not in st.session_state.results:
            st.warning("⚠️ Please run the AI & Quantum Engine first.")
        else:
            # SHAP Feature Importance
            st.subheader("🔍 Model Explainability (SHAP Values)")
            st.markdown("Providing transparent, doctor-friendly reasoning for the prediction.")
            features = ['CD4 Count', 'ZVI (Zonal Risk)', 'WBC Count', 'Age', 'Hemoglobin', 'Symptoms']
            importance = [0.35, 0.25, 0.15, 0.10, 0.08, 0.07]
            fig_shap = px.bar(x=features, y=importance, labels={'x':'Feature', 'y':'Impact Score'}, 
                              color=importance, color_continuous_scale='Blues', text_auto='.2f')
            fig_shap.update_layout(showlegend=False)
            st.plotly_chart(fig_shap, use_container_width=True)
            
            # Zonal Heatmap
            st.subheader("🗺️ Zonal Vulnerability Index (ZVI) Heatmap")
            map_data = pd.DataFrame({
                'State': ['Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Tamil Nadu', 'Telangana'],
                'ZVI Score': [0.85, 0.72, 0.68, 0.65, 0.60],
                'Active Cases': [12000, 8500, 7200, 6800, 5400]
            })
            fig_map = px.bar(map_data, x='State', y='ZVI Score', color='Active Cases', 
                             labels={'ZVI Score':'Vulnerability Index'}, color_continuous_scale='Reds', text_auto='.2f')
            st.plotly_chart(fig_map, use_container_width=True)
            
            # Download Report
            st.subheader("📄 Generate Clinical Report")
            report_data = pd.DataFrame([st.session_state.patient_data])
            csv = report_data.to_csv(index=False).encode('utf-8')
            st.download_button("⬇️ Download Patient CSV Report", csv, "patient_report.csv", "text/csv", use_container_width=True)
